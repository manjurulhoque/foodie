package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/manjurulhoque/foodie/backend/internal/models"
	"github.com/manjurulhoque/foodie/backend/internal/services"
	"github.com/manjurulhoque/foodie/backend/pkg/utils"
)

type OwnerHandler struct {
	restaurantService services.RestaurantService
	orderService      services.OrderService
	db                *gorm.DB
}

func NewOwnerHandler(restaurantService services.RestaurantService, orderService services.OrderService, db *gorm.DB) *OwnerHandler {
	return &OwnerHandler{restaurantService: restaurantService, orderService: orderService, db: db}
}

// GetRestaurants godoc
// @Summary Get all restaurants for an owner
// @Description Get all restaurants for an owner
// @Tags restaurants
// @Accept json
// @Produce json
// @Success 200 {object} utils.GenericResponse[[]models.Restaurant]
// @Router /owner/restaurants [get]
func (h *OwnerHandler) GetRestaurants(c *gin.Context) {
	restaurants, err := h.restaurantService.GetAllRestaurantsByOwnerID(c.GetUint("user_id"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to retrieve restaurants",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}
	c.JSON(http.StatusOK, utils.GenericResponse[[]models.Restaurant]{
		Success: true,
		Message: "Restaurants retrieved successfully",
		Data:    restaurants,
	})
}

// GetOrders godoc
// @Summary Get orders for a restaurant
// @Description Get all orders for a restaurant
// @Tags orders
// @Accept json
// @Produce json
// @Success 200 {object} utils.GenericResponse[[]models.Order]
// @Router /owner/orders [get]
func (h *OwnerHandler) GetOrders(c *gin.Context) {
	orders, err := h.orderService.GetRestaurantOrders(c.GetUint("restaurant_id"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to retrieve orders",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}
	c.JSON(http.StatusOK, utils.GenericResponse[[]models.Order]{
		Success: true,
		Message: "Orders retrieved successfully",
		Data:    orders,
	})
}