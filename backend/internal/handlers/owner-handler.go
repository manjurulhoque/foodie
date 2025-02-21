package handlers

import (
	"net/http"
	"strconv"

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
	userID := utils.GetUserID(c)
	restaurants, err := h.restaurantService.GetAllRestaurantsByOwnerID(userID)
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
func (h *OwnerHandler) GetAllOrders(c *gin.Context) {
	orders, err := h.orderService.GetAllOrders()
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

// UpdateOrderStatus godoc
// @Summary Update the status of an order
// @Description Update the status of an order
// @Tags orders
// @Accept json
// @Produce json
func (h *OwnerHandler) UpdateOrderStatus(c *gin.Context) {
	orderID := c.Param("id")
	orderIDUint, err := strconv.ParseUint(orderID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid order ID",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}
	order, err := h.orderService.GetOrder(uint(orderIDUint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to retrieve order",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}
	var input struct {
		Status string `json:"status" binding:"required,oneof=pending preparing ready delivered cancelled"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid input",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}
	order.Status = input.Status
	err = h.orderService.UpdateOrder(order)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to update order status",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}
	c.JSON(http.StatusOK, utils.GenericResponse[models.Order]{
		Success: true,
		Message: "Order status updated successfully",
		Data:    *order,
	})
}
