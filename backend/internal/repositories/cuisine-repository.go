package repositories

import (
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"gorm.io/gorm"
)

type CuisineRepository struct {
	db *gorm.DB
}

func NewCuisineRepository(db *gorm.DB) CuisineRepository {
	return CuisineRepository{db: db}
}

func (r *CuisineRepository) Create(cuisine map[string]interface{}) error {
	return r.db.Model(&models.Cuisine{}).Create(cuisine).Error
}

func (r *CuisineRepository) FindByID(id uint) (*models.Cuisine, error) {
	var cuisine models.Cuisine
	err := r.db.First(&cuisine, id).Error
	if err != nil {
		return nil, err
	}
	return &cuisine, nil
}

func (r *CuisineRepository) FindAll() ([]models.Cuisine, error) {
	var cuisines []models.Cuisine
	err := r.db.Find(&cuisines).Error
	return cuisines, err
}

func (r *CuisineRepository) Update(id uint, cuisine map[string]interface{}) error {
	return r.db.Model(&models.Cuisine{}).Where("id = ?", id).Updates(cuisine).Error
}

func (r *CuisineRepository) Delete(id uint) error {
	return r.db.Delete(&models.Cuisine{}, id).Error
}

func (r *CuisineRepository) FindPopular() ([]models.Cuisine, error) {
	var cuisines []models.Cuisine
	err := r.db.Where("is_popular = ?", true).Find(&cuisines).Error
	return cuisines, err
}
