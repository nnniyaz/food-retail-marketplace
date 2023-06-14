package main

import (
	"context"
	"github/nnniyaz/ardo"
	"github/nnniyaz/ardo/config"
	"github/nnniyaz/ardo/handler/http"
	"github/nnniyaz/ardo/pkg/env"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/pkg/uuid"
	"github/nnniyaz/ardo/repo"
	"github/nnniyaz/ardo/service"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
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
		env.MustGetEnv("MONGO_URI"),
		env.MustGetEnvAsBool("IS_DEV_MODE"),
		env.MustGetEnv("SMTP_USER"),
		env.MustGetEnv("SMTP_PASS"),
		env.MustGetEnv("SMTP_HOST"),
		env.MustGetEnv("SMTP_PORT"),
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

	mongoClient, err := initDbConnection(ctx, cf.GetMongoUri())
	if err != nil {
		lg.Fatal("failed to init mongodb", zap.Error(err))
		return
	}

	repos := repo.NewRepository(mongoClient)
	services := service.NewService(repos, cf.GetServiceConfig(), lg)
	handlers := http.NewHandler(services, lg, cf.GetClientUri())

	srv := new(ardo.Server)
	if err := srv.Run(port, handlers.InitRoutes(cf.GetIsDevMode())); err != nil {
		lg.Fatal("error occurred while running http server: ", zap.Error(err))
	}
}

func initDbConnection(ctx context.Context, mongoUri string) (*mongo.Client, error) {
	mongoOptions := options.Client().ApplyURI(mongoUri).SetRegistry(uuid.MongoRegistry)
	client, err := mongo.Connect(ctx, mongoOptions)
	if err != nil {
		return client, err
	}

	if err = client.Ping(ctx, readpref.Primary()); err != nil {
		return client, err
	}
	return client, nil
}
