package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"github.com/manjurulhoque/foodie/backend/internal/services"
	"github.com/manjurulhoque/foodie/backend/pkg/utils"
)

type AddressHandler struct {
	service services.AddressService
}

func NewAddressHandler(service services.AddressService) *AddressHandler {
	return &AddressHandler{service: service}
}

func (h *AddressHandler) CreateAddress(c *gin.Context) {
	var address models.Address
	if err := c.ShouldBindJSON(&address); err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	// Set user ID from authenticated user
	userID := uint(c.GetFloat64("user_id"))
	address.UserID = userID

	if err := h.service.CreateAddress(&address); err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to create address",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusCreated, utils.GenericResponse[models.Address]{
		Success: true,
		Message: "Address created successfully",
		Data:    address,
	})
}

func (h *AddressHandler) UpdateAddress(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	var address map[string]interface{}
	if err := c.ShouldBindJSON(&address); err != nil {
		c.JSON(http.StatusBadRequest, utils.GenericResponse[any]{
			Success: false,
			Message: "Invalid request",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	// Add user ID to updates
	address["user_id"] = uint(c.GetFloat64("user_id"))

	if err := h.service.UpdateAddress(uint(id), address); err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to update address",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Address updated successfully",
	})
}

func (h *AddressHandler) DeleteAddress(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	if err := h.service.DeleteAddress(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to delete address",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Address deleted successfully",
	})
}

func (h *AddressHandler) GetUserAddresses(c *gin.Context) {
	userID := uint(c.GetFloat64("user_id"))
	addresses, err := h.service.GetUserAddresses(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to get addresses",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[[]models.Address]{
		Success: true,
		Message: "Addresses retrieved successfully",
		Data:    addresses,
	})
}
