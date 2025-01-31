package services

import (
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"github.com/manjurulhoque/foodie/backend/internal/repositories"
)

type CategoryService interface {
	CreateCategory(map[string]interface{}) error
	GetCategory(uint) (*models.Category, error)
	GetAllCategories() ([]models.Category, error)
	UpdateCategory(uint, map[string]interface{}) error
	DeleteCategory(uint) error
}

type categoryService struct {
	repo repositories.CategoryRepository
}

func NewCategoryService(repo repositories.CategoryRepository) CategoryService {
	return &categoryService{repo: repo}
}

func (s *categoryService) CreateCategory(category map[string]interface{}) error {
	return s.repo.Create(category)
}

func (s *categoryService) GetCategory(id uint) (*models.Category, error) {
	return s.repo.FindByID(id)
}

func (s *categoryService) GetAllCategories() ([]models.Category, error) {
	return s.repo.FindAll()
}

func (s *categoryService) UpdateCategory(id uint, category map[string]interface{}) error {
	return s.repo.Update(id, category)
}

func (s *categoryService) DeleteCategory(id uint) error {
	return s.repo.Delete(id)
}
