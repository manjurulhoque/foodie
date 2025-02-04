package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"github.com/manjurulhoque/foodie/backend/internal/services"
	"github.com/manjurulhoque/foodie/backend/pkg/utils"
)

type OrderHandler struct {
	service services.OrderService
	cartService services.CartService
}

func NewOrderHandler(service services.OrderService, cartService services.CartService) *OrderHandler {
	return &OrderHandler{service: service, cartService: cartService}
}

func (h *OrderHandler) CreateOrder(c *gin.Context) {
	var orderInput struct {
		DeliveryAddress string `json:"delivery_address" binding:"required"`
		PaymentMethod   string `json:"payment_method" binding:"required"`
	}
	if err := c.ShouldBindJSON(&orderInput); err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request body",
			Data:    nil,
		})
		return
	}

	userID := utils.GetUserID(c)

	// get cart
	cart, err := h.cartService.GetUserCart(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to get cart",
			Data:    nil,
		})
		return
	}
	// get cart items
	cartItems, err := h.cartService.GetCartItems(cart.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to get cart items",
			Data:    nil,
		})
		return
	}

	// get total amount
	totalAmount := 0.0
	for _, item := range cartItems {
		totalAmount += item.MenuItem.Price * float64(item.Quantity)
	}

	//  can not have items from different restaurants
	restaurantIDs := make(map[uint]bool)
	for _, item := range cartItems {
		restaurantIDs[item.MenuItem.RestaurantID] = true
	}
	if len(restaurantIDs) > 1 {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Items from different restaurants cannot be combined in a single order",
			Data:    nil,
		})
		return
	}

	// create order
	order := &models.Order{
		DeliveryAddress: orderInput.DeliveryAddress,
		PaymentMethod:   orderInput.PaymentMethod,
		UserID:          userID,
		TotalAmount:     totalAmount,
	}

	err = h.service.CreateOrder(order)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to create order",
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[models.Order]{
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
