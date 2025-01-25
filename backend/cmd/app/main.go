package main

import (
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/foodie/backend/internal/config"
	"github.com/manjurulhoque/foodie/backend/internal/db"
	"github.com/manjurulhoque/foodie/backend/internal/handlers"
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"github.com/manjurulhoque/foodie/backend/internal/repositories"
	"github.com/manjurulhoque/foodie/backend/internal/services"
	"log/slog"
	"net/http"
	"time"
)

func init() {
	// load the configuration
	config.LoadConfig()

	// initialize the database
	_, err := db.InitializeDB()
	if err != nil {
		slog.Error("Failed to initialize database", "error", err.Error())
		panic(err)
	}

	err = db.DB.AutoMigrate(
		&models.User{}, &models.Address{})
	if err != nil {
		slog.Error("Error migrating database", "error", err.Error())
		panic(fmt.Sprintf("Error migrating database: %v", err))
	}
}

func main() {
	// create a new gin server and run it
	router := gin.Default()
	defer db.CloseDB(db.DB)

	// Initialize repositories with pointer receivers
	userRepo := repositories.NewUserRepository(db.DB)

	// Initialize services with pointer receivers
	userService := services.NewUserService(userRepo)

	// Initialize handlers with pointer receivers
	userHandler := handlers.NewUserHandler(userService)

	// CORS configuration - using a single config instance
	corsConfig := cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}
	router.Use(cors.New(corsConfig))

	// Group API routes for better organization and middleware reuse
	api := router.Group("/api")
	{
		api.GET("/ping", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "pong",
			})
		})

		// Auth routes
		api.POST("/register", userHandler.Register)
		api.POST("/login", userHandler.Login)
	}

	// run the server
	if err := router.Run(":9000"); err != nil {
		slog.Error("Failed to start server", "error", err.Error())
		panic(err)
	}
}
