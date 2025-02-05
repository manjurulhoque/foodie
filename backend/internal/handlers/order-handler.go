package handlers

import (
	"net/http"
	"log/slog"

	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"github.com/manjurulhoque/foodie/backend/internal/services"
	"github.com/manjurulhoque/foodie/backend/pkg/utils"

	"gorm.io/gorm"
)

type OrderHandler struct {
	service     services.OrderService
	cartService services.CartService
	db          *gorm.DB
}

func NewOrderHandler(service services.OrderService, cartService services.CartService, db *gorm.DB) *OrderHandler {
	return &OrderHandler{service: service, cartService: cartService, db: db}
}

func (h *OrderHandler) CreateOrder(c *gin.Context) {
	var orderInput struct {
		DeliveryAddress string  `json:"delivery_address" binding:"required"`
		PaymentMethod   string  `json:"payment_method" binding:"required"`
		TotalPrice      float64 `json:"total_price" binding:"required"`
		RestaurantID    uint    `json:"restaurant_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&orderInput); err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request body",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	userID := utils.GetUserID(c)

	// Get user's cart
	cart, err := h.cartService.GetUserCart(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to get cart",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	// Create order items from cart items
	var orderItems []models.OrderItem
	for _, cartItem := range cart.Items {
		orderItems = append(orderItems, models.OrderItem{
			MenuItemID: cartItem.MenuItemID,
			Quantity:   cartItem.Quantity,
			Price:      cartItem.MenuItem.Price,
		})
	}

	// Create order
	order := &models.Order{
		UserID:          userID,
		RestaurantID:    orderInput.RestaurantID,
		DeliveryAddress: orderInput.DeliveryAddress,
		PaymentMethod:   orderInput.PaymentMethod,
		TotalAmount:     orderInput.TotalPrice,
		Status:          "pending",
		PaymentStatus:   "pending",
		Items:           orderItems,
	}

	if err := h.service.CreateOrder(order); err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to create order",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	// Clear the cart after successful order creation
	if err := h.cartService.ClearCart(cart.ID); err != nil {
		// Log the error but don't fail the request
		slog.Error("Failed to clear cart after order creation", "error", err.Error())
	}

	c.JSON(http.StatusCreated, utils.GenericResponse[models.Order]{
		Success: true,
		Message: "Order created successfully",
		Data:    *order,
	})
}

func (h *OrderHandler) GetUserOrders(c *gin.Context) {
	userID := utils.GetUserID(c)

	orders, err := h.service.GetUserOrders(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[[]models.Order]{
			Success: false,
			Message: "Failed to fetch orders",
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[[]models.Order]{
		Success: true,
		Message: "Orders fetched successfully",
		Data:    orders,
	})
}
