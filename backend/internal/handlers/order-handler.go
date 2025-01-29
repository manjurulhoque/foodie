package handlers

import (
	"github.com/manjurulhoque/foodie/backend/internal/services"
)

type OrderHandler struct {
	service *services.OrderService
}

func NewOrderHandler(service *services.OrderService) *OrderHandler {
	return &OrderHandler{service: service}
}
