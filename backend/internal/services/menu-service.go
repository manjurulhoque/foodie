package services

import (
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"github.com/manjurulhoque/foodie/backend/internal/repositories"
)

type MenuService interface {
	GetAllMenuItems() ([]models.MenuItem, error)
	CreateMenuItem(menuItem *models.MenuItem) error
	GetMenuItem(id uint) (*models.MenuItem, error)
	UpdateMenuItem(menuItem *models.MenuItem) error
	DeleteMenuItem(id uint) error
	GetMenuItemsByCategory(restaurantID uint, category string) ([]models.MenuItem, error)
}

type menuService struct {
	repo repositories.MenuRepository
}

func NewMenuService(repo repositories.MenuRepository) MenuService {
	return &menuService{repo: repo}
}

func (s *menuService) GetAllMenuItems() ([]models.MenuItem, error) {
	return s.repo.FindAll()
}

func (s *menuService) CreateMenuItem(menuItem *models.MenuItem) error {
	return s.repo.Create(menuItem)
}

func (s *menuService) GetMenuItem(id uint) (*models.MenuItem, error) {
	return s.repo.FindByID(id)
}

func (s *menuService) GetRestaurantMenu(restaurantID uint) ([]models.MenuItem, error) {
	return s.repo.FindByRestaurant(restaurantID)
}

func (s *menuService) UpdateMenuItem(menuItem *models.MenuItem) error {
	return s.repo.Update(menuItem)
}

func (s *menuService) DeleteMenuItem(id uint) error {
	return s.repo.Delete(id)
}

func (s *menuService) GetMenuItemsByCategory(restaurantID uint, category string) ([]models.MenuItem, error) {
	return s.repo.FindByCategory(restaurantID, category)
}
