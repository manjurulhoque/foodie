package services

import (
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"github.com/manjurulhoque/foodie/backend/internal/repositories"
)

type RestaurantService struct {
	repo *repositories.RestaurantRepository
}

func NewRestaurantService(repo *repositories.RestaurantRepository) *RestaurantService {
	return &RestaurantService{repo: repo}
}

func (s *RestaurantService) CreateRestaurant(restaurant *models.Restaurant) error {
	return s.repo.Create(restaurant)
}

func (s *RestaurantService) GetRestaurant(id uint) (*models.Restaurant, error) {
	return s.repo.FindByID(id)
}

func (s *RestaurantService) GetAllRestaurants() ([]models.Restaurant, error) {
	return s.repo.FindAll()
}

func (s *RestaurantService) UpdateRestaurant(restaurant *models.Restaurant) error {
	return s.repo.Update(restaurant)
}

func (s *RestaurantService) DeleteRestaurant(id uint) error {
	return s.repo.Delete(id)
}

func (s *RestaurantService) GetRestaurantsByUser(userID uint) ([]models.Restaurant, error) {
	return s.repo.FindByUserID(userID)
}
