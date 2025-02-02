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
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := utils.GetUserID(c)

	// get cart
	cart, err := h.cartService.GetUserCart(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// get cart items
	cartItems, err := h.cartService.GetCartItems(cart.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
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
		c.JSON(http.StatusBadRequest, gin.H{"error": "Items from different restaurants cannot be combined in a single order"})
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
}