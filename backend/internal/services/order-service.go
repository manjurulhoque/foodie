package services

import (
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"github.com/manjurulhoque/foodie/backend/internal/repositories"
)

type OrderService struct {
	repo     *repositories.OrderRepository
	menuRepo *repositories.MenuRepository
}

func NewOrderService(repo *repositories.OrderRepository, menuRepo *repositories.MenuRepository) *OrderService {
	return &OrderService{
		repo:     repo,
		menuRepo: menuRepo,
	}
}

func (s *OrderService) CreateOrder(order *models.Order) error {
	var totalAmount float64
	for i := range order.Items {
		menuItem, err := s.menuRepo.FindByID(order.Items[i].MenuItemID)
		if err != nil {
			return err
		}
		order.Items[i].Price = menuItem.Price
		totalAmount += menuItem.Price * float64(order.Items[i].Quantity)
	}
	order.TotalAmount = totalAmount

	return s.repo.Create(order)
}

func (s *OrderService) GetOrder(id uint) (*models.Order, error) {
	return s.repo.FindByID(id)
}

func (s *OrderService) GetUserOrders(userID uint) ([]models.Order, error) {
	return s.repo.FindByUser(userID)
}

func (s *OrderService) GetRestaurantOrders(restaurantID uint) ([]models.Order, error) {
	return s.repo.FindByRestaurant(restaurantID)
}

func (s *OrderService) UpdateOrderStatus(id uint, status string) error {
	return s.repo.UpdateStatus(id, status)
}

func (s *OrderService) UpdatePaymentStatus(id uint, status string) error {
	return s.repo.UpdatePaymentStatus(id, status)
}
