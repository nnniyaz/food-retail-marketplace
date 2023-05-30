package main

import (
	"context"
	"github/nnniyaz/ardo"
	"github/nnniyaz/ardo/handler/http"
	"github/nnniyaz/ardo/pkg/env"
	"github/nnniyaz/ardo/pkg/uuid"
	"github/nnniyaz/ardo/repo"
	"github/nnniyaz/ardo/service"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"log"
	"time"
)

const port = 8080

func main() {
	var mongoUri = env.MustGetEnv("MONGO_URI")

	mongoClient := initDbConnection(mongoUri)

	repos := repo.NewRepository(mongoClient)
	services := service.NewService(repos)
	handlers := http.NewHandler(services)

	srv := new(ardo.Server)
	if err := srv.Run(port, handlers.InitRoutes()); err != nil {
		log.Fatalf("error occured while running http server: %s", err.Error())
	}
}

func initDbConnection(mongoUri string) mongo.Client {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	mongoOptions := options.Client().ApplyURI(mongoUri).SetRegistry(uuid.MongoRegistry)
	client, err := mongo.Connect(ctx, mongoOptions)
	if err != nil {
		log.Fatal(err)
	}

	err = client.Ping(ctx, readpref.Primary())
	if err != nil {
		log.Fatal(err)
	}

	return *client
}
