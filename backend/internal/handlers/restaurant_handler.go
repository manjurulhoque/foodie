package handlers

import (
	"encoding/json"
	"fmt"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/google/uuid"

	"github.com/manjurulhoque/foodie/backend/internal/models"
	"github.com/manjurulhoque/foodie/backend/internal/services"
	"github.com/manjurulhoque/foodie/backend/pkg/utils"

	"log/slog"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type RestaurantHandler struct {
	service services.RestaurantService
	db      *gorm.DB
}

func NewRestaurantHandler(service services.RestaurantService, db *gorm.DB) *RestaurantHandler {
	return &RestaurantHandler{service: service, db: db}
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
	var input struct {
		Name        string                `form:"name" binding:"required"`
		Description string                `form:"description"`
		Address     string                `form:"address" binding:"required"`
		Phone       string                `form:"phone" binding:"required"`
		Email       string                `form:"email" binding:"required,email"`
		CuisineIDs  []uint                `form:"cuisine_ids"`
		Image       *multipart.FileHeader `form:"image"`
	}

	// Bind form data
	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid form data",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		c.Abort()
		return
	}

	// Parse cuisine IDs from form value
	cuisineIDsStr := c.PostForm("cuisine_ids")
	if cuisineIDsStr != "" {
		var cuisineIDs []uint
		if err := json.Unmarshal([]byte(cuisineIDsStr), &cuisineIDs); err != nil {
			c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
				Success: false,
				Message: "Invalid cuisine IDs format",
				Errors:  []utils.ErrorDetail{{Message: err.Error()}},
			})
			c.Abort()
			return
		}
		input.CuisineIDs = cuisineIDs
	}

	userID := utils.GetUserID(c)
	// Create the restaurant first
	restaurant := models.Restaurant{
		Name:        input.Name,
		Description: input.Description,
		Address:     input.Address,
		Phone:       input.Phone,
		Email:       input.Email,
		UserID:      &userID,
	}

	// Handle image upload if provided
	if input.Image != nil {
		// Define the path where files should be saved
		uploadsPath := "./web/uploads/restaurants"

		// Check if the uploads directory exists; create it if it doesn't
		if _, err := os.Stat(uploadsPath); os.IsNotExist(err) {
			err = os.MkdirAll(uploadsPath, os.ModePerm)
			if err != nil {
				slog.Error("Failed to create uploads directory", "error", err.Error())
				c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
					Success: false,
					Message: "Failed to create uploads directory",
					Errors:  []utils.ErrorDetail{{Message: err.Error()}},
				})
				c.Abort()
				return
			}
		}
		extension := filepath.Ext(input.Image.Filename)
		newFileName := fmt.Sprintf("%s%s", uuid.New().String(), extension)
		filePath := filepath.Join(uploadsPath, newFileName)

		// Save the uploaded file
		if err := c.SaveUploadedFile(input.Image, filePath); err != nil {
			slog.Error("Error saving file", "error", err.Error())
			c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
				Success: false,
				Message: "Failed to save image",
				Errors:  []utils.ErrorDetail{{Message: err.Error()}},
			})
			c.Abort()
			return
		}
		restaurant.Image = filePath
	}

	// Start a transaction
	tx := h.db.Begin()
	if err := tx.Create(&restaurant).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to create restaurant",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		c.Abort()
		return
	}

	// Get cuisines and set the association
	if len(input.CuisineIDs) > 0 {
		var cuisines []models.Cuisine
		if err := tx.Where("id IN ?", input.CuisineIDs).Find(&cuisines).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
				Success: false,
				Message: "Failed to fetch cuisines",
				Errors:  []utils.ErrorDetail{{Message: err.Error()}},
			})
			c.Abort()
			return
		}

		// Set the many-to-many association
		if err := tx.Model(&restaurant).Association("Cuisines").Replace(cuisines); err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
				Success: false,
				Message: "Failed to associate cuisines",
				Errors:  []utils.ErrorDetail{{Message: err.Error()}},
			})
			c.Abort()
			return
		}
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to commit transaction",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusCreated, utils.GenericResponse[models.Restaurant]{
		Success: true,
		Message: "Restaurant created successfully",
		Data:    restaurant,
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
	// Get pagination params from query
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	cuisineID, _ := strconv.Atoi(c.DefaultQuery("cuisine_id", "0"))
	minRating, _ := strconv.ParseFloat(c.DefaultQuery("min_rating", "0"), 32)

	// we won't allow more than 100 items at a time
	if limit > 100 {
		limit = 10
	}

	// Get all restaurants with filters and pagination
	restaurants, total, err := h.service.GetAllRestaurants(page, limit, uint(cuisineID), float32(minRating))
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to get restaurants",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	totalPages := (int(total) + limit - 1) / limit // Ceiling division

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Restaurants retrieved successfully",
		Data: map[string]interface{}{
			"data": restaurants,
			"meta": map[string]interface{}{
				"total":      total,
				"page":       page,
				"limit":      limit,
				"totalPages": totalPages,
			},
		},
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
		c.Abort()
		return
	}
	// get existing restaurant
	var existingRestaurant models.Restaurant
	if err := h.db.First(&existingRestaurant, id).Error; err != nil {
		c.JSON(http.StatusNotFound, utils.GenericResponse[any]{
			Success: false,
			Message: "Restaurant not found",
		})
		c.Abort()
		return
	}

	var restaurantInput struct {
		ID          uint                  `form:"id" json:"id"`
		Name        string                `form:"name" json:"name" binding:"required"`
		Description string                `form:"description" json:"description"`
		Address     string                `form:"address" json:"address" binding:"required"`
		Phone       string                `form:"phone" json:"phone" binding:"required"`
		Email       string                `form:"email" json:"email" binding:"required,email"`
		CuisineIDs  []uint                `form:"cuisine_ids[]" json:"cuisine_ids"`
		Image       *multipart.FileHeader `form:"image" json:"image"`
	}

	if err := c.ShouldBind(&restaurantInput); err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		c.Abort()
		return
	}

	// Parse cuisine IDs from form value
	cuisineIDsStr := c.PostForm("cuisine_ids")
	if cuisineIDsStr != "" {
		var cuisineIDs []uint
		if err := json.Unmarshal([]byte(cuisineIDsStr), &cuisineIDs); err != nil {
			c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
				Success: false,
				Message: "Invalid cuisine IDs format",
				Errors:  []utils.ErrorDetail{{Message: err.Error()}},
			})
			c.Abort()
			return
		}
		restaurantInput.CuisineIDs = cuisineIDs
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
		c.Abort()
		return
	}

	tx := h.db.Begin()

	// Get existing restaurant
	var restaurant models.Restaurant
	if err := tx.First(&restaurant, id).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, utils.GenericResponse[any]{
			Success: false,
			Message: "Restaurant not found",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		c.Abort()
		return
	}

	// Update basic fields
	restaurant.ID = existingRestaurant.ID
	restaurant.Name = restaurantInput.Name
	restaurant.Description = restaurantInput.Description
	restaurant.Address = restaurantInput.Address
	restaurant.Phone = restaurantInput.Phone
	restaurant.Email = restaurantInput.Email
	restaurant.UserID = existingRestaurant.UserID

	// Handle image upload if provided
	if restaurantInput.Image != nil {
		uploadsPath := "./web/uploads/restaurants"
		extension := filepath.Ext(restaurantInput.Image.Filename)
		newFileName := fmt.Sprintf("%s%s", uuid.New().String(), extension)
		filePath := filepath.Join(uploadsPath, newFileName)
		if err := c.SaveUploadedFile(restaurantInput.Image, filePath); err != nil {
			slog.Error("Error saving file", "error", err.Error())
			c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
				Success: false,
				Message: "Failed to save image",
				Errors:  []utils.ErrorDetail{{Message: err.Error()}},
			})
			c.Abort()
			return
		}
		// TODO: delete old image
		// check if the image path exists
		restaurant.Image = filePath
	}

	// Update the restaurant
	if err := tx.Save(&restaurant).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to update restaurant",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		c.Abort()
		return
	}

	// Update cuisine associations if provided
	if len(restaurantInput.CuisineIDs) > 0 {
		var cuisines []models.Cuisine
		if err := tx.Where("id IN ?", restaurantInput.CuisineIDs).Find(&cuisines).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
				Success: false,
				Message: "Failed to fetch cuisines",
				Errors:  []utils.ErrorDetail{{Message: err.Error()}},
			})
			c.Abort()
			return
		}

		// Replace existing associations
		if err := tx.Model(&restaurant).Association("Cuisines").Replace(cuisines); err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
				Success: false,
				Message: "Failed to update cuisine associations",
				Errors:  []utils.ErrorDetail{{Message: err.Error()}},
			})
			c.Abort()
			return
		}
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to commit transaction",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[models.Restaurant]{
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
			Success: false,
			Message: "Invalid request",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		c.Abort()
		return
	}

	if err := h.service.DeleteRestaurant(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to delete restaurant",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Restaurant deleted successfully",
	})
}

// GetRestaurantsByCuisine handler
func (h *RestaurantHandler) GetRestaurantsByCuisine(c *gin.Context) {
	cuisineID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid cuisine id",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		c.Abort()
		return
	}

	restaurants, err := h.service.GetRestaurantsByCuisine(uint(cuisineID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to get restaurants",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[[]models.Restaurant]{
		Success: true,
		Message: "Restaurants found",
		Data:    restaurants,
	})
}

// UpdateWorkingHours restaurant handler
// @Summary Update working hours for a restaurant
// @Description Update working hours for a restaurant
// @Tags restaurants
// @Accept json
// @Produce json
// @Success 200 {object} models.Restaurant
// @Router /restaurants/:id/working-hours [put]
func (h *RestaurantHandler) UpdateWorkingHours(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		c.Abort()
		return
	}

	var workingHours []models.WorkingHour
	if err := c.ShouldBindJSON(&workingHours); err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request body",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		c.Abort()
		return
	}

	if err := h.service.UpdateWorkingHours(uint(id), workingHours); err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to update working hours",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Working hours updated successfully",
	})
}

// GetWorkingHours restaurant handler
// @Summary Get working hours for a restaurant
// @Description Get working hours for a restaurant
// @Tags restaurants
// @Accept json
// @Produce json
// @Success 200 {array} models.WorkingHour
// @Router /restaurants/:id/working-hours [get]
func (h *RestaurantHandler) GetWorkingHours(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		c.Abort()
		return
	}

	workingHours, err := h.service.GetWorkingHours(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to get working hours",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[[]models.WorkingHour]{
		Success: true,
		Message: "Working hours retrieved successfully",
		Data:    workingHours,
	})
}

// UpdateRestaurantOwner restaurant handler
// @Summary Update restaurant owner
// @Description Update restaurant owner by email
// @Tags restaurants
// @Accept json
// @Produce json
// @Param id path int true "Restaurant ID"
// @Param email body string true "Owner Email"
// @Success 200 {object} models.Restaurant
// @Router /admin/restaurants/{id}/owner [post]
func (h *RestaurantHandler) UpdateRestaurantOwner(c *gin.Context) {
	// Get restaurant ID from URL
	restaurantID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid restaurant ID",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		c.Abort()
		return
	}

	// Parse request body
	var input struct {
		Email string `json:"email" binding:"required,email"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request body",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		c.Abort()
		return
	}

	// Find user by email
	var user models.User
	if err := h.db.Where("email = ?", input.Email).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, utils.GenericResponse[any]{
				Success: false,
				Message: "User not found",
				Errors:  []utils.ErrorDetail{{Message: "No user found with this email"}},
			})
			c.Abort()
			return
		}
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Error finding user",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		c.Abort()
		return
	}

	// Get restaurant
	var restaurant models.Restaurant
	if err := h.db.First(&restaurant, restaurantID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, utils.GenericResponse[any]{
				Success: false,
				Message: "Restaurant not found",
				Errors:  []utils.ErrorDetail{{Message: "Restaurant not found"}},
			})
			c.Abort()
			return
		}
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Error finding restaurant",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		c.Abort()
		return
	}

	// Start transaction
	tx := h.db.Begin()

	// Update user role to owner if not already
	if user.Role != "owner" {
		if err := tx.Model(&user).Update("role", "owner").Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
				Success: false,
				Message: "Error updating user role",
				Errors:  []utils.ErrorDetail{{Message: err.Error()}},
			})
			c.Abort()
			return
		}
	}

	// Update restaurant owner
	if err := tx.Model(&restaurant).Update("user_id", user.ID).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Error updating restaurant owner",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		c.Abort()
		return
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Error committing transaction",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Restaurant owner updated successfully",
	})
}
