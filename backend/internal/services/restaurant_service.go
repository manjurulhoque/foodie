package services

import (
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"github.com/manjurulhoque/foodie/backend/internal/repositories"
)

type RestaurantService interface {
	CreateRestaurant(map[string]interface{}) error
	GetRestaurant(id uint) (*models.Restaurant, error)
	UpdateRestaurant(restaurant interface{}, id uint) error
	DeleteRestaurant(id uint) error
	GetRestaurantsByUser(userID uint) ([]models.Restaurant, error)
	GetAllRestaurants(page, limit int, cuisineID uint, minRating float32) ([]models.Restaurant, int64, error)
	GetRestaurantsByCuisine(cuisineID uint) ([]models.Restaurant, error)
	UpdateWorkingHours(uint, []models.WorkingHour) error
	GetWorkingHours(uint) ([]models.WorkingHour, error)
	GetAllRestaurantsByOwnerID(userID uint) ([]models.Restaurant, error)
}

type restaurantService struct {
	repo repositories.RestaurantRepository
}

func NewRestaurantService(repo repositories.RestaurantRepository) RestaurantService {
	return &restaurantService{repo: repo}
}

func (s *restaurantService) CreateRestaurant(restaurant map[string]interface{}) error {
	return s.repo.Create(restaurant)
}

func (s *restaurantService) GetRestaurant(id uint) (*models.Restaurant, error) {
	return s.repo.FindByID(id)
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

func (s *restaurantService) GetAllRestaurants(page, limit int, cuisineID uint, minRating float32) ([]models.Restaurant, int64, error) {
	return s.repo.FindAllPaginated(page, limit, cuisineID, minRating)
}

func (s *restaurantService) GetRestaurantsByCuisine(cuisineID uint) ([]models.Restaurant, error) {
	return s.repo.FindRestaurantsByCuisineID(cuisineID)
}

func (s *restaurantService) UpdateWorkingHours(restaurantID uint, workingHours []models.WorkingHour) error {
	return s.repo.UpdateWorkingHours(restaurantID, workingHours)
}

func (s *restaurantService) GetWorkingHours(restaurantID uint) ([]models.WorkingHour, error) {
	return s.repo.GetWorkingHours(restaurantID)
}

func (s *restaurantService) GetAllRestaurantsByOwnerID(userID uint) ([]models.Restaurant, error) {
	return s.repo.FindAllRestaurantsByOwnerID(userID)
}
