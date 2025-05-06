package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"github.com/manjurulhoque/foodie/backend/internal/services"
	"github.com/manjurulhoque/foodie/backend/pkg/utils"

	"gorm.io/gorm"
)

type CuisineHandler struct {
	service services.CuisineService
	db      *gorm.DB
}

func NewCuisineHandler(service services.CuisineService, db *gorm.DB) *CuisineHandler {
	return &CuisineHandler{service: service, db: db}
}

// CreateCuisine godoc
// @Summary Create a new cuisine
// @Description Create a new cuisine
// @Tags cuisines
// @Accept json
// @Produce json
// @Success 201 {object} any
// @Router /cuisines [post]
func (h *CuisineHandler) CreateCuisine(c *gin.Context) {
	var cuisineInput struct {
		Name        string `json:"name" validate:"required"`
		Description string `json:"description"`
		IsActive    bool   `json:"is_active"`
	}

	if err := c.ShouldBindJSON(&cuisineInput); err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	cuisineMap := map[string]interface{}{
		"name":        cuisineInput.Name,
		"description": cuisineInput.Description,
		"is_active":   cuisineInput.IsActive,
	}

	if err := h.service.CreateCuisine(cuisineMap); err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to create cuisine",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusCreated, utils.GenericResponse[any]{
		Success: true,
		Message: "Cuisine created successfully",
		Data:    cuisineMap,
	})
}

// GetCuisine godoc
// @Summary Get a cuisine by ID
// @Description Get a cuisine by ID
// @Tags cuisines
// @Accept json
// @Produce json
// @Success 200 {object} any
// @Router /cuisines/{id} [get]
func (h *CuisineHandler) GetCuisine(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	cuisine, err := h.service.GetCuisine(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, utils.GenericResponse[any]{
			Success: false,
			Message: "Cuisine not found",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Cuisine retrieved successfully",
		Data:    cuisine,
	})
}

// GetAllCuisines godoc
// @Summary Get all cuisines
// @Description Get all cuisines
// @Tags cuisines
// @Accept json
// @Produce json
// @Success 200 {object} any
// @Router /cuisines [get]
func (h *CuisineHandler) GetAllCuisines(c *gin.Context) {
	cuisines, err := h.service.GetAllCuisines()
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to retrieve cuisines",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Cuisines retrieved successfully",
		Data:    cuisines,
	})
}

// UpdateCuisine godoc
// @Summary Update a cuisine
// @Description Update a cuisine
// @Tags cuisines
// @Accept json
// @Produce json
// @Success 200 {object} any
// @Router /cuisines/{id} [put]
func (h *CuisineHandler) UpdateCuisine(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	var cuisineInput struct {
		Name        string `json:"name" validate:"required"`
		Description string `json:"description"`
		IsActive    bool   `json:"is_active"`
	}

	if err := c.ShouldBindJSON(&cuisineInput); err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	cuisineMap := map[string]interface{}{
		"name":        cuisineInput.Name,
		"description": cuisineInput.Description,
		"is_active":   cuisineInput.IsActive,
	}

	if err := h.service.UpdateCuisine(uint(id), cuisineMap); err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to update cuisine",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Cuisine updated successfully",
		Data:    cuisineMap,
	})
}

// GetPopularCuisines handler
// @Summary Get popular cuisines
// @Description Get popular cuisines
// @Tags cuisines
// @Accept json
// @Produce json
// @Success 200 {object} any
// @Router /cuisines/popular [get]
func (h *CuisineHandler) GetPopularCuisines(c *gin.Context) {
	cuisines, err := h.service.GetPopularCuisines()
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to get popular cuisines",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[[]models.Cuisine]{
		Success: true,
		Message: "Popular cuisines found",
		Data:    cuisines,
	})
}
