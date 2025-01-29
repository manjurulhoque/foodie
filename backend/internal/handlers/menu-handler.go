package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/foodie/backend/internal/services"
	"github.com/manjurulhoque/foodie/backend/pkg/utils"
)

type MenuHandler struct {
	service *services.MenuService
}

func NewMenuHandler(service *services.MenuService) *MenuHandler {
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
