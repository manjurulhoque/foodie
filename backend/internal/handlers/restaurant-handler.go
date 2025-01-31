package handlers

import (
	"fmt"
	"github.com/google/uuid"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/manjurulhoque/foodie/backend/internal/services"
	"github.com/manjurulhoque/foodie/backend/pkg/utils"

	"log/slog"

	"github.com/gin-gonic/gin"
)

type RestaurantHandler struct {
	service services.RestaurantService
}

func NewRestaurantHandler(service services.RestaurantService) *RestaurantHandler {
	return &RestaurantHandler{service: service}
}

// CreateRestaurant restaurant handler
// @Summary Create a restaurant
// @Description Create a restaurant
// @Tags restaurants
// @Accept json
// @Produce json
// @Success 200 {object} models.Restaurant
// @Router /restaurants [post]
func (h *RestaurantHandler) CreateRestaurant(c *gin.Context) {
	var restaurantInput struct {
		Name        string                `form:"name" validate:"required"`
		Description string                `form:"description" validate:"required"`
		Address     string                `form:"address" validate:"required"`
		Phone       string                `form:"phone" validate:"required"`
		Email       string                `form:"email" validate:"required"`
		CuisineID   uint                  `form:"cuisine_id" validate:"required"`
		UserID      uint                  `validate:"required"`
		Image       *multipart.FileHeader `form:"image" validate:"required"`
	}
	if err := c.ShouldBind(&restaurantInput); err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	// Get user ID from context (set by auth middleware)
	userID := c.GetUint("userId")
	restaurantMap := map[string]interface{}{
		"name":        restaurantInput.Name,
		"description": restaurantInput.Description,
		"address":     restaurantInput.Address,
		"phone":       restaurantInput.Phone,
		"email":       restaurantInput.Email,
		"cuisine_id":  restaurantInput.CuisineID,
		"user_id":     userID,
	}

	restaurantInput.UserID = userID

	translateErrors := utils.TranslateError(restaurantInput)
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

	if restaurantInput.Image != nil {
		// Define the path where files should be saved
		uploadsPath := "./web/uploads/restaurants"

		// Check if the uploads directory exists; create it if it doesn't
		if _, err := os.Stat(uploadsPath); os.IsNotExist(err) {
			err = os.MkdirAll(uploadsPath, os.ModePerm)
			if err != nil {
				slog.Error("Failed to create uploads directory", "error", err.Error())
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create uploads directory"})
				return
			}
		}
		extension := filepath.Ext(restaurantInput.Image.Filename)
		newFileName := fmt.Sprintf("%s%s", uuid.New().String(), extension)
		filePath := filepath.Join(uploadsPath, newFileName)

		// Save the uploaded file
		if err := c.SaveUploadedFile(restaurantInput.Image, filePath); err != nil {
			slog.Error("Error saving file", "error", err.Error())
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "status": false})
			return
		}
		restaurantMap["image"] = filePath
	}

	if err := h.service.CreateRestaurant(restaurantMap); err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to create restaurant",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusCreated, utils.GenericResponse[any]{
		Success: true,
		Message: "Restaurant created successfully",
		Data:    restaurantMap,
	})
}

// GetRestaurant restaurant handler
// @Summary Get a restaurant
// @Description Get a restaurant
// @Tags restaurants
// @Accept json
// @Produce json
// @Success 200 {object} models.Restaurant
// @Router /restaurants/:id [get]
func (h *RestaurantHandler) GetRestaurant(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	restaurant, err := h.service.GetRestaurant(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, utils.GenericResponse[any]{
			Success: false,
			Message: "Restaurant not found",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Restaurant found",
		Data:    restaurant,
	})
}

// GetAllRestaurants restaurant handler
// @Summary Get all restaurants
// @Description Get all restaurants
// @Tags restaurants
// @Accept json
// @Produce json
// @Success 200 {array} models.Restaurant
// @Router /restaurants [get]
func (h *RestaurantHandler) GetAllRestaurants(c *gin.Context) {
	restaurants, err := h.service.GetAllRestaurants()
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to get restaurants",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Restaurants found",
		Data:    restaurants,
	})
}

// UpdateRestaurant restaurant handler
// @Summary Update a restaurant
// @Description Update a restaurant
// @Tags restaurants
// @Accept json
// @Produce json
// @Success 200 {object} models.Restaurant
// @Router /restaurants/:id [put]
func (h *RestaurantHandler) UpdateRestaurant(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	var restaurantInput struct {
		ID          uint                  `form:"id" json:"id"`
		Name        string                `form:"name" json:"name"`
		Description string                `form:"description" json:"description"`
		Address     string                `form:"address" json:"address"`
		Phone       string                `form:"phone" json:"phone"`
		Email       string                `form:"email" json:"email"`
		CuisineID   uint                  `form:"cuisine_id" json:"cuisine_id"`
		Image       *multipart.FileHeader `form:"image" json:"image"`
	}

	if err := c.ShouldBind(&restaurantInput); err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	translateErrors := utils.TranslateError(restaurantInput)
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

	restaurantMap := map[string]interface{}{
		"name":        restaurantInput.Name,
		"description": restaurantInput.Description,
		"address":     restaurantInput.Address,
		"phone":       restaurantInput.Phone,
		"email":       restaurantInput.Email,
		"cuisine_id":  restaurantInput.CuisineID,
	}

	if restaurantInput.Image != nil {
		uploadsPath := "./web/uploads/restaurants"
		extension := filepath.Ext(restaurantInput.Image.Filename)
		newFileName := fmt.Sprintf("%s%s", uuid.New().String(), extension)
		filePath := filepath.Join(uploadsPath, newFileName)
		if err := c.SaveUploadedFile(restaurantInput.Image, filePath); err != nil {
			slog.Error("Error saving file", "error", err.Error())
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "status": false})
			return
		}
		// TODO: delete old image
		// check if the image path exists

		restaurantMap["image"] = filePath
	}

	restaurantInput.ID = uint(id)
	if err := h.service.UpdateRestaurant(restaurantMap, uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to update restaurant",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Restaurant updated successfully",
		Data: map[string]any{
			"id":          restaurantInput.ID,
			"name":        restaurantInput.Name,
			"description": restaurantInput.Description,
			"address":     restaurantInput.Address,
			"phone":       restaurantInput.Phone,
			"email":       restaurantInput.Email,
			"cuisine_id":  restaurantInput.CuisineID,
		},
	})
}

// DeleteRestaurant restaurant handler
// @Summary Delete a restaurant
// @Description Delete a restaurant
// @Tags restaurants
// @Accept json
// @Produce json
// @Success 200 {object} models.Restaurant
// @Router /restaurants/:id [delete]
func (h *RestaurantHandler) DeleteRestaurant(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	if err := h.service.DeleteRestaurant(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to delete restaurant",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Restaurant deleted successfully",
	})
}
