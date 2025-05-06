package services

import (
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"github.com/manjurulhoque/foodie/backend/internal/repositories"
)

type MenuService interface {
	GetAllMenuItems(int, int) ([]models.MenuItem, int64, error)
	CreateMenuItem(map[string]interface{}, uint) error
	GetMenuItem(uint) (*models.MenuItem, error)
	UpdateMenuItem(uint, map[string]interface{}) (*models.MenuItem, error)
	DeleteMenuItem(uint) error
	GetMenuItemsByCategory(uint, string) ([]models.MenuItem, error)
	GetRestaurantMenuItems(uint) ([]models.MenuItem, error)
}

type menuService struct {
	repo repositories.MenuRepository
}

func NewMenuService(repo repositories.MenuRepository) MenuService {
	return &menuService{repo: repo}
}

func (s *menuService) GetAllMenuItems(page int, limit int) ([]models.MenuItem, int64, error) {
	return s.repo.FindAllPaginated(page, limit)
}

func (s *menuService) CreateMenuItem(menuItem map[string]interface{}, restaurantID uint) error {
	menuItem["restaurant_id"] = restaurantID
	return s.repo.Create(menuItem)
}

func (s *menuService) GetMenuItem(id uint) (*models.MenuItem, error) {
	return s.repo.FindByID(id)
}

func (s *menuService) GetRestaurantMenuItems(restaurantID uint) ([]models.MenuItem, error) {
	return s.repo.FindByRestaurant(restaurantID)
}

func (s *menuService) UpdateMenuItem(id uint, menuItem map[string]interface{}) (*models.MenuItem, error) {
	return s.repo.Update(id, menuItem)
}

func (s *menuService) DeleteMenuItem(id uint) error {
	return s.repo.Delete(id)
}

func (s *menuService) GetMenuItemsByCategory(restaurantID uint, category string) ([]models.MenuItem, error) {
	return s.repo.FindByCategory(restaurantID, category)
}
