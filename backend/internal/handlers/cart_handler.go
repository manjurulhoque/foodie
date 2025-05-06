package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/foodie/backend/internal/services"
	"github.com/manjurulhoque/foodie/backend/pkg/utils"

	"gorm.io/gorm"
)

type CartHandler struct {
	service services.CartService
	db      *gorm.DB
}

func NewCartHandler(service services.CartService, db *gorm.DB) *CartHandler {
	return &CartHandler{service: service, db: db}
}

// GetCart godoc
// @Summary Get user's cart
// @Description Get user's cart with items
// @Tags cart
// @Accept json
// @Produce json
// @Success 200 {object} models.Cart
// @Router /cart [get]
func (h *CartHandler) GetCart(c *gin.Context) {
	userID := utils.GetUserID(c)
	cart, err := h.service.GetUserCart(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to get cart",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Cart retrieved successfully",
		Data:    cart,
	})
}

// AddToCart godoc
// @Summary Add item to cart
// @Description Add a menu item to user's cart
// @Tags cart
// @Accept json
// @Produce json
// @Success 200 {object} models.Cart
// @Router /cart/items [post]
func (h *CartHandler) AddToCart(c *gin.Context) {
	var input struct {
		MenuItemID uint `json:"menu_item_id" binding:"required"`
		Quantity   int  `json:"quantity" binding:"required,min=1"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	userID := utils.GetUserID(c)
	err := h.service.AddToCart(userID, input.MenuItemID, input.Quantity)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to add item to cart",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	cart, _ := h.service.GetUserCart(userID)
	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Item added to cart successfully",
		Data:    cart,
	})
}

// UpdateCartItem godoc
// @Summary Update cart item quantity
// @Description Update the quantity of an item in the cart
// @Tags cart
// @Accept json
// @Produce json
// @Success 200 {object} models.Cart
// @Router /cart/items/{id} [put]
func (h *CartHandler) UpdateCartItem(c *gin.Context) {
	itemID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid item ID",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	var input struct {
		Quantity int `json:"quantity" binding:"required,min=1"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	err = h.service.UpdateCartItemQuantity(uint(itemID), input.Quantity)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to update cart item",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	userID := utils.GetUserID(c)
	cart, _ := h.service.GetUserCart(userID)
	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Cart item updated successfully",
		Data:    cart,
	})
}

// RemoveFromCart godoc
// @Summary Remove item from cart
// @Description Remove an item from the cart
// @Tags cart
// @Accept json
// @Produce json
// @Success 200 {object} string
// @Router /cart/items/{id} [delete]
func (h *CartHandler) RemoveFromCart(c *gin.Context) {
	itemID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid item ID",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	err = h.service.RemoveFromCart(uint(itemID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to remove item from cart",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	userID := utils.GetUserID(c)
	cart, _ := h.service.GetUserCart(userID)
	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Item removed from cart successfully",
		Data:    cart,
	})
}

// ClearCart godoc
// @Summary Clear cart
// @Description Remove all items from the cart
// @Tags cart
// @Accept json
// @Produce json
// @Success 200 {object} string
// @Router /cart [delete]
func (h *CartHandler) ClearCart(c *gin.Context) {
	userID := utils.GetUserID(c)
	cart, err := h.service.GetUserCart(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to get cart",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	err = h.service.ClearCart(cart.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to clear cart",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Cart cleared successfully",
	})
}
