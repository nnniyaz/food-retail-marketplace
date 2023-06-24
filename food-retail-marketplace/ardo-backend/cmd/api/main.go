package main

import (
	"context"
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
		env.MustGetEnv("API_URI"),
		env.MustGetEnv("CLIENT_URI"),
	)

	// --- init logger
	lg, err := logger.NewLogger(cf.GetIsDevMode())
	if err != nil {
		panic(err)
	}
	defer lg.Sync()

	lg.Info("starting", zap.Time("start", start))

	// --- init mongodb db
	db, err := mongo.New(ctx, env.MustGetEnv("MONGO_URI"))
	if err != nil {
		lg.Fatal("failed to init mongodb", zap.Error(err))
		return
	}
	defer db.Disconnect(ctx)

	// --- init email service
	emailService, err := email.New(email.Config{
		Host:     env.MustGetEnv("SMTP_HOST"),
		Port:     env.MustGetEnvAsInt("SMTP_PORT"),
		Username: env.MustGetEnv("SMTP_USER"),
		Password: env.MustGetEnv("SMTP_PASS"),
	})
	if err != nil {
		lg.Fatal("failed to init email service", zap.Error(err))
		return
	}

	repos := repo.NewRepository(db)
	services := service.NewService(repos, cf, lg, emailService)
	handlers := http.NewHandler(services, lg, cf.GetClientUri())

	srv := new(ardo.Server)
	if err := srv.Run(port, handlers.InitRoutes(cf.GetIsDevMode())); err != nil {
		lg.Fatal("error occurred while running http server: ", zap.Error(err))
	}
}
