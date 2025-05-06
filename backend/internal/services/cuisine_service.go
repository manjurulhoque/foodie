package services

import (
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"github.com/manjurulhoque/foodie/backend/internal/repositories"
)

type CuisineService interface {
	CreateCuisine(map[string]interface{}) error
	GetCuisine(uint) (*models.Cuisine, error)
	GetAllCuisines() ([]models.Cuisine, error)
	UpdateCuisine(uint, map[string]interface{}) error
	DeleteCuisine(uint) error
	GetPopularCuisines() ([]models.Cuisine, error)
}

type cuisineService struct {
	repo repositories.CuisineRepository
}

func NewCuisineService(repo repositories.CuisineRepository) CuisineService {
	return &cuisineService{repo: repo}
}

func (s *cuisineService) CreateCuisine(cuisine map[string]interface{}) error {
	return s.repo.Create(cuisine)
}

func (s *cuisineService) GetCuisine(id uint) (*models.Cuisine, error) {
	return s.repo.FindByID(id)
}

func (s *cuisineService) GetAllCuisines() ([]models.Cuisine, error) {
	return s.repo.FindAll()
}

func (s *cuisineService) UpdateCuisine(id uint, cuisine map[string]interface{}) error {
	return s.repo.Update(id, cuisine)
}

func (s *cuisineService) DeleteCuisine(id uint) error {
	return s.repo.Delete(id)
}

func (s *cuisineService) GetPopularCuisines() ([]models.Cuisine, error) {
	return s.repo.FindPopular()
}
