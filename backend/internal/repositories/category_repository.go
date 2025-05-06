package repositories

import (
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"gorm.io/gorm"
)

type CategoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) CategoryRepository {
	return CategoryRepository{db: db}
}

func (r *CategoryRepository) Create(category map[string]interface{}) error {
	return r.db.Model(&models.Category{}).Create(category).Error
}

func (r *CategoryRepository) FindByID(id uint) (*models.Category, error) {
	var category models.Category
	err := r.db.First(&category, id).Error
	if err != nil {
		return nil, err
	}
	return &category, nil
}

func (r *CategoryRepository) FindAll() ([]models.Category, error) {
	var categories []models.Category
	err := r.db.Find(&categories).Error
	return categories, err
}

func (r *CategoryRepository) Update(id uint, category map[string]interface{}) error {
	return r.db.Model(&models.Category{}).Where("id = ?", id).Updates(category).Error
}

func (r *CategoryRepository) Delete(id uint) error {
	return r.db.Delete(&models.Category{}, id).Error
}
