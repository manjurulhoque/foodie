package handlers

import (
	"log/slog"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/foodie/backend/internal/services"
	"github.com/manjurulhoque/foodie/backend/pkg/utils"
)

type MenuHandler struct {
	service services.MenuService
}

func NewMenuHandler(service services.MenuService) *MenuHandler {
	return &MenuHandler{service: service}
}

// GetMenuItem menu handler
// @Summary Get a menu item
// @Description Get a menu item
// @Tags menu
// @Accept json
// @Produce json
// @Success 200 {object} any
// @Router /menu/:id [get]
func (h *MenuHandler) GetMenuItem(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	menuItem, err := h.service.GetMenuItem(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, utils.GenericResponse[any]{
			Success: false,
			Message: "Menu item not found",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Menu item found",
		Data:    menuItem,
	})
}

// GetAllMenuItems menu handler
// @Summary Get all menu items
// @Description Get all menu items
// @Tags menu
// @Accept json
// @Produce json
// @Success 200 {object} any
// @Router /menu [get]
func (h *MenuHandler) GetAllMenuItems(c *gin.Context) {
	menuItems, err := h.service.GetAllMenuItems()
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to get menu items",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Menu items found",
		Data:    menuItems,
	})
}

// GetRestaurantMenuItems menu handler
// @Summary Get all menu items of a restaurant
// @Description Get all menu items of a restaurant
// @Tags menu
// @Accept json
// @Produce json
// @Success 200 {object} any
// @Router /restaurants/:id/menu [get]
func (h *MenuHandler) GetRestaurantMenuItems(c *gin.Context) {
	restaurantID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid restaurant id",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	menuItems, err := h.service.GetRestaurantMenuItems(uint(restaurantID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to get menu items",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Menu items found",
		Data:    menuItems,
	})
}

// CreateMenuItem menu handler
// @Summary Create a menu item
// @Description Create a menu item
// @Tags menu
// @Accept json
// @Produce json
// @Success 200 {object} any
// @Router /menu [post]
func (h *MenuHandler) CreateMenuItem(c *gin.Context) {
	var menuItem struct {
		Name         string  `json:"name" validate:"required"`
		Description  string  `json:"description"`
		Price        float64 `json:"price" validate:"required"`
		Image        string  `json:"image"`
		Category     string  `json:"category" validate:"required"`
		RestaurantID uint    `json:"restaurant_id"`
		IsAvailable  bool    `json:"is_available"`
	}
	if err := c.ShouldBindJSON(&menuItem); err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	restaurantID, convertErr := strconv.ParseUint(c.Param("id"), 10, 32)
	if convertErr != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid restaurant id",
			Errors:  []utils.ErrorDetail{{Message: convertErr.Error()}},
		})
		return
	}

	slog.Info("Restaurant ID", "id", menuItem)

	translateErrors := utils.TranslateError(menuItem)
	if len(translateErrors) > 0 {
		newErrs := make([]utils.ErrorDetail, len(translateErrors))
		for i, err := range translateErrors {
			newErrs[i] = utils.ErrorDetail{
				Message: err.Message,
				Code:    err.Field,
			}
		}
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request",
			Errors:  newErrs,
		})
		return
	}

	menuItemMap := map[string]interface{}{
		"name":         menuItem.Name,
		"description":  menuItem.Description,
		"price":        menuItem.Price,
		"image":        menuItem.Image,
		"category":     menuItem.Category,
		"restaurant_id": uint(restaurantID),
		"is_available":  menuItem.IsAvailable,
	}

	if err := h.service.CreateMenuItem(menuItemMap, uint(restaurantID)); err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to create menu item",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusCreated, utils.GenericResponse[any]{
		Success: true,
		Message: "Menu item created",
		Data:    menuItem,
	})
}
