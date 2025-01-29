package main

import (
	"fmt"
	"log/slog"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/foodie/backend/docs"
	"github.com/manjurulhoque/foodie/backend/internal/config"
	"github.com/manjurulhoque/foodie/backend/internal/db"
	"github.com/manjurulhoque/foodie/backend/internal/handlers"
	"github.com/manjurulhoque/foodie/backend/internal/middlewares"
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"github.com/manjurulhoque/foodie/backend/internal/repositories"
	"github.com/manjurulhoque/foodie/backend/internal/services"
	"github.com/manjurulhoque/foodie/backend/pkg/utils"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
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
		&models.User{}, &models.Address{}, &models.Restaurant{}, &models.MenuItem{}, &models.Order{})
	if err != nil {
		slog.Error("Error migrating database", "error", err.Error())
		panic(fmt.Sprintf("Error migrating database: %v", err))
	}
}

// @title Foodie API
// @version 1.0
// @description This is a sample server.
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:9000
// @BasePath /api
// @schemes http
func main() {
	// create a new gin server and run it
	router := gin.Default()
	defer db.CloseDB(db.DB)

	// Initialize repositories with pointer receivers
	userRepo := repositories.NewUserRepository(db.DB)
	restaurantRepo := repositories.NewRestaurantRepository(db.DB)
	menuRepo := repositories.NewMenuRepository(db.DB)
	orderRepo := repositories.NewOrderRepository(db.DB)

	// Initialize services with pointer receivers
	userService := services.NewUserService(userRepo)
	restaurantService := services.NewRestaurantService(restaurantRepo)
	menuService := services.NewMenuService(menuRepo)
	orderService := services.NewOrderService(orderRepo, menuRepo)

	// Initialize handlers with pointer receivers
	userHandler := handlers.NewUserHandler(userService)
	restaurantHandler := handlers.NewRestaurantHandler(restaurantService)
	menuHandler := handlers.NewMenuHandler(menuService)
	_ = handlers.NewOrderHandler(orderService)

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

	docs.SwaggerInfo.BasePath = "/api"
	docs.SwaggerInfo.Host = "localhost:9000"
	docs.SwaggerInfo.Title = "Foodie API"
	docs.SwaggerInfo.Description = "Foodie API"

	// Group API routes for better organization and middleware reuse
	api := router.Group("/api")
	authMiddleware := middlewares.AuthMiddleware(userRepo, userService)
	adminMiddleware := middlewares.AdminMiddleware(userRepo, userService)
	{
		api.GET("/ping", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "pong",
			})
		})

		// Auth routes
		api.POST("/register", userHandler.Register)
		api.POST("/login", userHandler.Login)
		api.GET("/me", authMiddleware, userHandler.Me)

		// Menu routes
		menu := api.Group("/menu")
		{
			menu.GET("", menuHandler.GetAllMenuItems)
			menu.GET("/:id", menuHandler.GetMenuItem)
		}

		// Restaurant routes
		restaurants := api.Group("/restaurants")
		{
			restaurants.GET("", restaurantHandler.GetAllRestaurants)
			restaurants.GET("/:id", restaurantHandler.GetRestaurant)

			restaurants.POST("", authMiddleware, restaurantHandler.CreateRestaurant)
			restaurants.PUT("/:id", authMiddleware, restaurantHandler.UpdateRestaurant)
			restaurants.DELETE("/:id", authMiddleware, restaurantHandler.DeleteRestaurant)

			restaurantMenu := restaurants.Group("/:id/menu")
			{
				restaurantMenu.GET("", menuHandler.GetRestaurantMenuItems)
				restaurantMenu.POST("", authMiddleware, adminMiddleware, menuHandler.CreateMenuItem)
				restaurantMenu.GET("/:id", menuHandler.GetMenuItem)
			}
		}
	}

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Set the user repository in the utils package
	utils.SetUserRepo(userRepo)

	// run the server
	if err := router.Run(":9000"); err != nil {
		slog.Error("Failed to start server", "error", err.Error())
		panic(err)
	}
}
