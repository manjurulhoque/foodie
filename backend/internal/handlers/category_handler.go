package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/foodie/backend/internal/services"
	"github.com/manjurulhoque/foodie/backend/pkg/utils"

	"gorm.io/gorm"
)

type CategoryHandler struct {
	service services.CategoryService
	db      *gorm.DB
}

func NewCategoryHandler(service services.CategoryService, db *gorm.DB) *CategoryHandler {
	return &CategoryHandler{service: service, db: db}
}

func (h *CategoryHandler) CreateCategory(c *gin.Context) {
	var categoryInput struct {
		Name        string `json:"name" validate:"required"`
		Description string `json:"description"`
		IsActive    bool   `json:"is_active"`
	}

	if err := c.ShouldBindJSON(&categoryInput); err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	categoryMap := map[string]interface{}{
		"name":        categoryInput.Name,
		"description": categoryInput.Description,
		"is_active":   categoryInput.IsActive,
	}

	if err := h.service.CreateCategory(categoryMap); err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to create category",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusCreated, utils.GenericResponse[any]{
		Success: true,
		Message: "Category created successfully",
		Data:    categoryMap,
	})
}

// GetCategory godoc
// @Summary Get a category by ID
// @Description Get a category by ID
// @Tags categories
// @Accept json
// @Produce json
// @Success 200 {object} any
// @Router /categories/{id} [get]
func (h *CategoryHandler) GetCategory(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}
	category, err := h.service.GetCategory(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, utils.GenericResponse[any]{
			Success: false,
			Message: "Category not found",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Category retrieved successfully",
		Data:    category,
	})
}

// GetAllCategories godoc
// @Summary Get all categories
// @Description Get all categories
// @Tags categories
// @Accept json
// @Produce json
// @Success 200 {object} any
// @Router /categories [get]
func (h *CategoryHandler) GetAllCategories(c *gin.Context) {
	categories, err := h.service.GetAllCategories()
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to retrieve categories",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Categories retrieved successfully",
		Data:    categories,
	})
}

// UpdateCategory godoc
// @Summary Update a category
// @Description Update a category
// @Tags categories
// @Accept json
// @Produce json
// @Success 200 {object} any
// @Router /categories/{id} [put]
func (h *CategoryHandler) UpdateCategory(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	var categoryInput struct {
		Name        string `json:"name" validate:"required"`
		Description string `json:"description"`
		IsActive    bool   `json:"is_active"`
	}

	if err := c.ShouldBindJSON(&categoryInput); err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	categoryMap := map[string]interface{}{
		"name":        categoryInput.Name,
		"description": categoryInput.Description,
		"is_active":   categoryInput.IsActive,
	}

	if err := h.service.UpdateCategory(uint(id), categoryMap); err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to update category",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Category updated successfully",
		Data:    categoryMap,
	})
}

// DeleteCategory godoc
// @Summary Delete a category
// @Description Delete a category
// @Tags categories
// @Accept json
// @Produce json
// @Success 200 {object} any
// @Router /categories/{id} [delete]
func (h *CategoryHandler) DeleteCategory(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}
	if err := h.service.DeleteCategory(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to delete category",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Category deleted successfully",
	})
}
