package services

import (
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"github.com/manjurulhoque/foodie/backend/internal/repositories"
)

type RestaurantService interface {
	CreateRestaurant(restaurant *models.Restaurant) error
	GetRestaurant(id uint) (*models.Restaurant, error)
	GetAllRestaurants() ([]models.Restaurant, error)
	UpdateRestaurant(restaurant interface{}, id uint) error
	DeleteRestaurant(id uint) error
	GetRestaurantsByUser(userID uint) ([]models.Restaurant, error)
}

type restaurantService struct {
	repo repositories.RestaurantRepository
}

func NewRestaurantService(repo repositories.RestaurantRepository) RestaurantService {
	return &restaurantService{repo: repo}
}

func (s *restaurantService) CreateRestaurant(restaurant *models.Restaurant) error {
	return s.repo.Create(restaurant)
}

func (s *restaurantService) GetRestaurant(id uint) (*models.Restaurant, error) {
	return s.repo.FindByID(id)
}

func (s *restaurantService) GetAllRestaurants() ([]models.Restaurant, error) {
	return s.repo.FindAll()
}

func (s *restaurantService) UpdateRestaurant(restaurant interface{}, id uint) error {
	return s.repo.Update(restaurant, id)
}

func (s *restaurantService) DeleteRestaurant(id uint) error {
	return s.repo.Delete(id)
}

func (s *restaurantService) GetRestaurantsByUser(userID uint) ([]models.Restaurant, error) {
	return s.repo.FindRestaurantsByUserID(userID)
}
