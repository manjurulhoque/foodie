package handlers

import (
	"fmt"
	"log/slog"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/google/uuid"

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
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	menuItems, total, err := h.service.GetAllMenuItems(page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to get menu items",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	totalPages := (int(total) + limit - 1) / limit // Ceiling division

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Menu items found",
		Data: map[string]interface{}{
			"data": menuItems,
			"meta": map[string]interface{}{
				"total":      total,
				"page":       page,
				"limit":      limit,
				"totalPages": totalPages,
			},
		},
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
		Name         string                `form:"name" validate:"required"`
		Description  string                `form:"description" json:"description"`
		Price        float64               `form:"price" validate:"required"`
		Category     string                `form:"category" validate:"required"`
		RestaurantID uint                  `form:"restaurant_id" validate:"required"`
		IsAvailable  bool                  `form:"is_available" validate:"required"`
		Image        *multipart.FileHeader `form:"image" json:"image"`
	}
	if err := c.ShouldBind(&menuItem); err != nil {
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

	menuItem.RestaurantID = uint(restaurantID)

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
		"name":          menuItem.Name,
		"description":   menuItem.Description,
		"price":         menuItem.Price,
		"image":         menuItem.Image,
		"category":      menuItem.Category,
		"restaurant_id": uint(restaurantID),
		"is_available":  menuItem.IsAvailable,
	}

	// Handle file upload
	if menuItem.Image != nil {
		// Define the path where files should be saved
		uploadsPath := "./web/uploads"

		// Check if the uploads directory exists; create it if it doesn't
		if _, err := os.Stat(uploadsPath); os.IsNotExist(err) {
			err = os.MkdirAll(uploadsPath, os.ModePerm)
			if err != nil {
				slog.Error("Failed to create uploads directory", "error", err.Error())
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create uploads directory"})
				return
			}
		}
		extension := filepath.Ext(menuItem.Image.Filename)
		newFileName := fmt.Sprintf("%s%s", uuid.New().String(), extension)
		filePath := filepath.Join(uploadsPath, newFileName)

		// Save the uploaded file
		if err := c.SaveUploadedFile(menuItem.Image, filePath); err != nil {
			slog.Error("Error saving file", "error", err.Error())
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "status": false})
			return
		}
		menuItemMap["image"] = filePath
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

// UpdateMenuItem menu handler
// @Summary Update a menu item
// @Description Update a menu item
// @Tags menu
// @Accept json
// @Produce json
// @Success 200 {object} any
// @Router /menu/:id [put]
func (h *MenuHandler) UpdateMenuItem(c *gin.Context) {
	var menuItemInput struct {
		ID          uint                  `form:"id" validate:"required"`
		Name        string                `form:"name" validate:"required"`
		Description string                `form:"description" json:"description"`
		Price       float64               `form:"price" validate:"required"`
		Category    string                `form:"category" validate:"required"`
		IsAvailable bool                  `form:"is_available" validate:"required"`
		Image       *multipart.FileHeader `form:"image" json:"image"`
	}
	if err := c.ShouldBind(&menuItemInput); err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	menuItemMap := map[string]interface{}{
		"name":          menuItemInput.Name,
		"description":   menuItemInput.Description,
		"price":         menuItemInput.Price,
		"category":      menuItemInput.Category,
		"is_available":  menuItemInput.IsAvailable,
	}

	// Handle file upload
	if menuItemInput.Image != nil {
		// Define the path where files should be saved
		uploadsPath := "./web/uploads"

		// Check if the uploads directory exists; create it if it doesn't
		if _, err := os.Stat(uploadsPath); os.IsNotExist(err) {
			err = os.MkdirAll(uploadsPath, os.ModePerm)
			if err != nil {
				slog.Error("Failed to create uploads directory", "error", err.Error())
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create uploads directory"})
				return
			}
		}
		extension := filepath.Ext(menuItemInput.Image.Filename)
		newFileName := fmt.Sprintf("%s%s", uuid.New().String(), extension)
		filePath := filepath.Join(uploadsPath, newFileName)

		// Save the uploaded file
		if err := c.SaveUploadedFile(menuItemInput.Image, filePath); err != nil {
			slog.Error("Error saving file", "error", err.Error())
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "status": false})
			return
		}

		menuItemMap["image"] = filePath
	}

	menuItem, err := h.service.UpdateMenuItem(menuItemInput.ID, menuItemMap)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to update menu item",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}
	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Menu item updated",
		Data:    menuItem,
	})
}
