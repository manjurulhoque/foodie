package main

import (
	"fmt"
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
	cors "github.com/rs/cors/wrapper/gin"
	"log/slog"
	"net/http"
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
		&models.User{},
		&models.Address{},
		&models.Restaurant{},
		&models.MenuItem{},
		&models.Order{},
		&models.OrderItem{},
		&models.Category{},
		&models.Cuisine{},
		&models.Cart{},
		&models.CartItem{},
		&models.WorkingHour{},
		&models.OrderStatusHistory{},
	)
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
	router.Use(cors.Default())
	defer db.CloseDB(db.DB)

	// Initialize repositories with pointer receivers
	userRepo := repositories.NewUserRepository(db.DB)
	restaurantRepo := repositories.NewRestaurantRepository(db.DB)
	menuRepo := repositories.NewMenuRepository(db.DB)
	orderRepo := repositories.NewOrderRepository(db.DB)
	categoryRepo := repositories.NewCategoryRepository(db.DB)
	cuisineRepo := repositories.NewCuisineRepository(db.DB)
	cartRepo := repositories.NewCartRepository(db.DB)
	customerRepo := repositories.NewCustomerRepository(db.DB)
	addressRepo := repositories.NewAddressRepository(db.DB)

	// Initialize services with pointer receivers
	userService := services.NewUserService(userRepo)
	restaurantService := services.NewRestaurantService(restaurantRepo)
	menuService := services.NewMenuService(menuRepo)
	orderService := services.NewOrderService(orderRepo, menuRepo)
	categoryService := services.NewCategoryService(categoryRepo)
	cuisineService := services.NewCuisineService(cuisineRepo)
	cartService := services.NewCartService(cartRepo)
	customerService := services.NewCustomerService(customerRepo)
	addressService := services.NewAddressService(addressRepo)

	// Initialize handlers with pointer receivers
	userHandler := handlers.NewUserHandler(userService, db.DB)
	restaurantHandler := handlers.NewRestaurantHandler(restaurantService, db.DB)
	menuHandler := handlers.NewMenuHandler(menuService, db.DB)
	orderHandler := handlers.NewOrderHandler(orderService, cartService, db.DB)
	categoryHandler := handlers.NewCategoryHandler(categoryService, db.DB)
	cuisineHandler := handlers.NewCuisineHandler(cuisineService, db.DB)
	cartHandler := handlers.NewCartHandler(cartService, db.DB)
	customerHandler := handlers.NewCustomerHandler(customerService, db.DB)
	addressHandler := handlers.NewAddressHandler(addressService)
	ownerHandler := handlers.NewOwnerHandler(restaurantService, orderService, db.DB)

	// CORS configuration - using a single config instance
	//corsConfig := cors.Config{
	//	AllowOrigins:     []string{"http://localhost:3000", "http://foodie-backend.manjurulhoque.com", "http://foodie.manjurulhoque.com"},
	//	AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
	//	AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
	//	ExposeHeaders:    []string{"Content-Length"},
	//	AllowCredentials: true,
	//	MaxAge:           12 * time.Hour,
	//}

	docs.SwaggerInfo.BasePath = "/api"
	docs.SwaggerInfo.Host = "localhost:9000"
	docs.SwaggerInfo.Title = "Foodie API"
	docs.SwaggerInfo.Description = "Foodie API"

	// Group API routes for better organization and middleware reuse
	api := router.Group("/api")
	authMiddleware := middlewares.AuthMiddleware(userRepo, userService)
	adminMiddleware := middlewares.AdminMiddleware(userRepo, userService)
	ownerMiddleware := middlewares.OwnerMiddleware(userRepo, userService)
	adminOrOwnerMiddleware := middlewares.AdminOrOwnerMiddleware(userRepo, userService)
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
		api.PUT("/me", authMiddleware, userHandler.UpdateUser)
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
			restaurants.PUT("/:id/owner", authMiddleware, adminMiddleware, restaurantHandler.UpdateRestaurantOwner)
			restaurants.DELETE("/:id", authMiddleware, restaurantHandler.DeleteRestaurant)

			restaurantWorkingHours := restaurants.Group("/:id/working-hours")
			{
				restaurantWorkingHours.PUT("", authMiddleware, restaurantHandler.UpdateWorkingHours)
			}

			restaurantMenu := restaurants.Group("/:id/menu")
			{
				restaurantMenu.GET("", menuHandler.GetRestaurantMenuItems)
				restaurantMenu.POST("", authMiddleware, adminOrOwnerMiddleware, menuHandler.CreateMenuItem)
				restaurantMenu.PUT("/:id", authMiddleware, adminOrOwnerMiddleware, menuHandler.UpdateMenuItem)
				restaurantMenu.GET("/:id", menuHandler.GetMenuItem)
			}

			restaurantCuisine := restaurants.Group("/cuisine/:id")
			{
				restaurantCuisine.GET("", restaurantHandler.GetRestaurantsByCuisine)
			}
		}

		// Category routes
		categories := api.Group("/categories")
		{
			categories.GET("", categoryHandler.GetAllCategories)
			categories.GET("/:id", categoryHandler.GetCategory)
			categories.POST("", authMiddleware, adminMiddleware, categoryHandler.CreateCategory)
			categories.PUT("/:id", authMiddleware, adminMiddleware, categoryHandler.UpdateCategory)
		}

		// Cuisine routes
		cuisines := api.Group("/cuisines")
		{
			cuisines.GET("", cuisineHandler.GetAllCuisines)
			cuisines.GET("/popular", cuisineHandler.GetPopularCuisines)
			cuisines.GET("/:id", cuisineHandler.GetCuisine)
			cuisines.POST("", authMiddleware, adminMiddleware, cuisineHandler.CreateCuisine)
			cuisines.PUT("/:id", authMiddleware, adminMiddleware, cuisineHandler.UpdateCuisine)
		}

		// Cart routes
		cart := api.Group("/cart")
		{
			cart.Use(authMiddleware)
			cart.GET("", cartHandler.GetCart)
			cart.POST("/items", cartHandler.AddToCart)
			cart.PUT("/items/:id", cartHandler.UpdateCartItem)
			cart.DELETE("/items/:id", cartHandler.RemoveFromCart)
			cart.DELETE("", cartHandler.ClearCart)
		}

		// Order routes
		orders := api.Group("/orders")
		{
			orders.POST("", authMiddleware, orderHandler.CreateOrder)
			orders.GET("/user", authMiddleware, orderHandler.GetUserOrders)
			orders.GET("/:id/status-history", authMiddleware, orderHandler.GetOrderStatusHistory)
		}

		// Customer routes
		customers := api.Group("/customers")
		{
			customers.GET("", customerHandler.GetAllCustomers)
		}

		// User routes
		users := api.Group("/users")
		{
			users.GET("", authMiddleware, adminMiddleware, userHandler.GetAllUsers)
		}

		// Address routes
		addresses := api.Group("/addresses")
		{
			addresses.Use(authMiddleware)
			addresses.GET("", addressHandler.GetUserAddresses)
			addresses.POST("", addressHandler.CreateAddress)
			addresses.PUT("/:id", addressHandler.UpdateAddress)
			addresses.DELETE("/:id", addressHandler.DeleteAddress)
		}

		// Owner routes
		owner := api.Group("/owner")
		{
			owner.GET("/restaurants", authMiddleware, ownerMiddleware, ownerHandler.GetRestaurants)
			owner.GET("/orders", authMiddleware, ownerMiddleware, ownerHandler.GetAllOrders)
			owner.PUT("/orders/:id", authMiddleware, ownerMiddleware, ownerHandler.UpdateOrderStatus)
		}
	}

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	router.Static("/web/uploads", "./web/uploads")

	// Set the user repository in the utils package
	utils.SetUserRepo(userRepo)

	// run the server
	if err := router.Run(":9000"); err != nil {
		slog.Error("Failed to start server", "error", err.Error())
		panic(err)
	}
}
