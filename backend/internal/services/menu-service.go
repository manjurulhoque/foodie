package services

import (
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"github.com/manjurulhoque/foodie/backend/internal/repositories"
)

type MenuService struct {
	repo *repositories.MenuRepository
}

func NewMenuService(repo *repositories.MenuRepository) *MenuService {
	return &MenuService{repo: repo}
}

func (s *MenuService) GetAllMenuItems() ([]models.MenuItem, error) {
	return s.repo.FindAll()
}

func (s *MenuService) CreateMenuItem(menuItem *models.MenuItem) error {
	return s.repo.Create(menuItem)
}

func (s *MenuService) GetMenuItem(id uint) (*models.MenuItem, error) {
	return s.repo.FindByID(id)
}

func (s *MenuService) GetRestaurantMenu(restaurantID uint) ([]models.MenuItem, error) {
	return s.repo.FindByRestaurant(restaurantID)
}

func (s *MenuService) UpdateMenuItem(menuItem *models.MenuItem) error {
	return s.repo.Update(menuItem)
}

func (s *MenuService) DeleteMenuItem(id uint) error {
	return s.repo.Delete(id)
}

func (s *MenuService) GetMenuItemsByCategory(restaurantID uint, category string) ([]models.MenuItem, error) {
	return s.repo.FindByCategory(restaurantID, category)
}
