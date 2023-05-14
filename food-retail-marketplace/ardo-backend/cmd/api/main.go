package main

import (
	"context"
	"github/nnniyaz/ardo"
	"github/nnniyaz/ardo/pkg/env"
	"github/nnniyaz/ardo/pkg/handler"
	"github/nnniyaz/ardo/pkg/repository"
	"github/nnniyaz/ardo/pkg/service"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"log"
	"time"
)

func main() {
	var port = env.MustGetEnv("PORT")
	var mongoUri = env.MustGetEnv("MONGO_URI")

	mongoClient := initDbConnection(mongoUri)

	repos := repository.NewRepository(mongoClient)
	services := service.NewService(repos)
	handlers := handler.NewHandler(services)

	srv := new(ardo.Server)
	if err := srv.Run(port, handlers.InitRoutes()); err != nil {
		log.Fatalf("error occured while running http server: %s", err.Error())
	}
}

func initDbConnection(mongoUri string) mongo.Client {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoUri))
	if err != nil {
		log.Fatal(err)
	}

	err = client.Ping(ctx, readpref.Primary())
	if err != nil {
		log.Fatal(err)
	}

	return *client
}
