package repositories

import (
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"gorm.io/gorm"
)

type RestaurantRepository struct {
	db *gorm.DB
}

func NewRestaurantRepository(db *gorm.DB) RestaurantRepository {
	return RestaurantRepository{db: db}
}

func (r *RestaurantRepository) Create(restaurant map[string]interface{}) error {
	return r.db.Model(&models.Restaurant{}).Create(&restaurant).Error
}

func (r *RestaurantRepository) FindByID(id uint) (*models.Restaurant, error) {
	var restaurant models.Restaurant
	err := r.db.Preload("MenuItems").First(&restaurant, id).Error
	if err != nil {
		return nil, err
	}
	return &restaurant, nil
}

func (r *RestaurantRepository) FindAll() ([]models.Restaurant, error) {
	var restaurants []models.Restaurant
	err := r.db.Preload("MenuItems").Find(&restaurants).Error
	return restaurants, err
}

func (r *RestaurantRepository) Update(restaurant interface{}, id uint) error {
	return r.db.Model(&models.Restaurant{}).Where("id = ?", id).Updates(restaurant).Error
}

func (r *RestaurantRepository) Delete(id uint) error {
	return r.db.Delete(&models.Restaurant{}, id).Error
}

func (r *RestaurantRepository) FindRestaurantsByUserID(userID uint) ([]models.Restaurant, error) {
	var restaurants []models.Restaurant
	err := r.db.Where("user_id = ?", userID).Find(&restaurants).Error
	return restaurants, err
}
