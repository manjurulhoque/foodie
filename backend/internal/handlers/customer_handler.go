package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/foodie/backend/internal/services"
	"github.com/manjurulhoque/foodie/backend/pkg/utils"
	"gorm.io/gorm"
)

type CustomerHandler struct {
	service services.CustomerService
	db      *gorm.DB
}

func NewCustomerHandler(service services.CustomerService, db *gorm.DB) *CustomerHandler {
	return &CustomerHandler{service: service, db: db}
}

func (h *CustomerHandler) GetAllCustomers(c *gin.Context) {
	customers, err := h.service.GetAllCustomers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.GenericResponse[any]{
			Success: false,
			Message: "Failed to get customers",
			Errors:  []utils.ErrorDetail{{Message: err.Error()}},
		})
		return
	}

	c.JSON(http.StatusOK, utils.GenericResponse[any]{
		Success: true,
		Message: "Customers retrieved successfully",
		Data:    customers,
	})
}
