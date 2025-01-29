package handlers

import (
	"net/http"
	"strconv"

	"github.com/manjurulhoque/foodie/backend/internal/models"
	"github.com/manjurulhoque/foodie/backend/internal/services"
	"github.com/manjurulhoque/foodie/backend/pkg/utils"

	"github.com/gin-gonic/gin"
)

type RestaurantHandler struct {
	service *services.RestaurantService
}

func NewRestaurantHandler(service *services.RestaurantService) *RestaurantHandler {
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
	var restaurant models.Restaurant
	if err := c.ShouldBindJSON(&restaurant); err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success:    false,
			Message:    "Invalid request",
			Errors:     []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	errs := utils.TranslateError(restaurant)
	if len(errs) > 0 {
		newErrs := make([]utils.ErrorDetail, len(errs))
		for i, err := range errs {
			newErrs[i] = utils.ErrorDetail{
				Message: err.Message,
				Code:    err.Field,
			}
		}
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success:    false,
			Message:    "Invalid request",
			Errors:     newErrs,
		})
		return
	}

	// Get user ID from context (set by auth middleware)
	userID := c.GetUint("userId")
	restaurant.UserID = userID

	if err := h.service.CreateRestaurant(&restaurant); err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success:    false,
			Message:    "Failed to create restaurant",
			Errors:     []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}


	c.JSON(http.StatusCreated, utils.GenericResponse[any]{
		Success: true,
		Message: "Restaurant created successfully",
		Data:    map[string]any{
			"id": restaurant.ID,
			"name": restaurant.Name,
			"description": restaurant.Description,
			"address": restaurant.Address,
			"phone": restaurant.Phone,
			"email": restaurant.Email,
			"cuisine": restaurant.Cuisine,
			"rating": restaurant.Rating,
			"image": restaurant.Image,
			"is_active": restaurant.IsActive,
		},
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
			Success:    false,
			Message:    "Invalid request",
			Errors:     []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	restaurant, err := h.service.GetRestaurant(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, utils.GenericResponse[any]{
			Success:    false,
			Message:    "Restaurant not found",
			Errors:     []utils.ErrorDetail{{Message: err.Error()}},
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
			Success:    false,
			Message:    "Failed to get restaurants",
			Errors:     []utils.ErrorDetail{{Message: err.Error()}},
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
			Success:    false,
			Message:    "Invalid request",
			Errors:     []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	var restaurant models.Restaurant
	if err := c.ShouldBindJSON(&restaurant); err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success:    false,
			Message:    "Invalid request",
			Errors:     []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	restaurant.ID = uint(id)
	if err := h.service.UpdateRestaurant(&restaurant); err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success:    false,
			Message:    "Failed to update restaurant",
			Errors:     []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Restaurant updated successfully",
		Data:    restaurant,
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
			Success:    false,
			Message:    "Invalid request",
			Errors:     []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	if err := h.service.DeleteRestaurant(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success:    false,
			Message:    "Failed to delete restaurant",
			Errors:     []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Restaurant deleted successfully",
	})
}
