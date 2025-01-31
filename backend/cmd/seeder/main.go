package main

import (
	"fmt"
	"log/slog"

	"github.com/manjurulhoque/foodie/backend/internal/config"
	"github.com/manjurulhoque/foodie/backend/internal/db"
	"github.com/manjurulhoque/foodie/backend/internal/db/seeders"
)

func main() {
	// load the configuration
	config.LoadConfig()

	// initialize the database
	_, err := db.InitializeDB()
	if err != nil {
		slog.Error("Failed to initialize database", "error", err.Error())
		panic(err)
	}
	defer db.CloseDB(db.DB)

	// Run seeders
	if err := seeders.Seed(db.DB); err != nil {
		slog.Error("Error seeding database", "error", err.Error())
		panic(err)
	}

	fmt.Println("Database seeding completed successfully!")
}
