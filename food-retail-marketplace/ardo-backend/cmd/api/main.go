package main

import (
	"context"
	"fmt"
	"github/nnniyaz/ardo"
	"github/nnniyaz/ardo/config"
	"github/nnniyaz/ardo/handler/http"
	"github/nnniyaz/ardo/pkg/email"
	"github/nnniyaz/ardo/pkg/env"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/pkg/mongo"
	"github/nnniyaz/ardo/repo"
	"github/nnniyaz/ardo/service"
	"go.uber.org/zap"
	nHttp "net/http"
	"os/signal"
	"syscall"
	"time"
)

const port = 8080

func main() {
	start := time.Now()

	ctx, cancel := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer cancel()

	// --- init settings
	cf := config.New(
		env.MustGetEnvAsBool("IS_DEV_MODE"),
		env.MustGetEnvAsInt("SMTP_PORT"),
		env.MustGetEnv("SMTP_USER"),
		env.MustGetEnv("SMTP_PASS"),
		env.MustGetEnv("SMTP_HOST"),
		env.MustGetEnv("MONGO_URI"),
		env.MustGetEnv("API_URI"),
		env.MustGetEnv("CLIENT_URI"),
		env.MustGetEnv("SPACE_KEY"),
		env.MustGetEnv("SPACE_SECRET"),
	)

	// --- init logger
	lg, err := logger.NewLogger(cf.GetIsDevMode())
	if err != nil {
		panic(err)
	}
	defer lg.Sync()

	lg.Info("starting", zap.Time("start", start))

	// --- init mongodb db
	db, err := mongo.New(ctx, cf.GetMongoUri())
	if err != nil {
		lg.Fatal("failed to init mongodb", zap.Error(err))
		return
	}
	defer db.Disconnect(ctx)

	// --- init email service
	emailService, err := email.New(cf.GetEmailCfg())
	if err != nil {
		lg.Fatal("failed to init email service", zap.Error(err))
		return
	}

	repos := repo.NewRepository(db)
	services := service.NewService(repos, cf, lg, emailService)
	handlers := http.NewHandler(services, cf.GetClientUri(), lg)

	srv := new(ardo.Server)
	go func() {
		if err = srv.Run(port, handlers.InitRoutes(cf.GetIsDevMode())); err != nil && err != nHttp.ErrServerClosed {
			lg.Fatal("error occurred while running http server: ", zap.Error(err))
		}
	}()

	<-ctx.Done()

	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer shutdownCancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		lg.Error("error occurred on server shutting down: ", zap.Error(err))
	}

	if err := db.Disconnect(shutdownCtx); err != nil {
		lg.Error("error occurred on db connection close: ", zap.Error(err))
	}

	lg.Info("server shutting down", zap.Time("stopped", start))
	fmt.Print("\nSERVER SHUTTING DOWN GRACEFULLY\n")
}
