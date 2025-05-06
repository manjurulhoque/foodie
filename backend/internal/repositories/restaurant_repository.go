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
	err := r.db.Preload("MenuItems").Preload("Cuisines").Preload("WorkingHours").First(&restaurant, id).Error
	if err != nil {
		return nil, err
	}
	return &restaurant, nil
}

func (r *RestaurantRepository) FindAll() ([]models.Restaurant, error) {
	var restaurants []models.Restaurant
	err := r.db.Preload("MenuItems", func(db *gorm.DB) *gorm.DB {
		return db.Order("menu_items.created_at DESC")
	}).Preload("Cuisine").Find(&restaurants).Error
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

func (r *RestaurantRepository) FindAllPaginated(page, limit int, cuisineID uint, minRating float32) ([]models.Restaurant, int64, error) {
	var restaurants []models.Restaurant
	var total int64
	offset := (page - 1) * limit

	query := r.db.Model(&models.Restaurant{})

	if cuisineID > 0 {
		query = query.Joins("JOIN restaurant_cuisines ON restaurants.id = restaurant_cuisines.restaurant_id").
			Where("restaurant_cuisines.cuisine_id = ?", cuisineID)
	}

	if minRating > 0 {
		query = query.Where("rating >= ?", minRating)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := query.Preload("MenuItems").
		Preload("Cuisines").
		Offset(offset).
		Limit(limit).
		Find(&restaurants).Error

	return restaurants, total, err
}

func (r *RestaurantRepository) FindRestaurantsByCuisineID(cuisineID uint) ([]models.Restaurant, error) {
	var restaurants []models.Restaurant
	err := r.db.Where("cuisine_id = ?", cuisineID).Find(&restaurants).Error
	return restaurants, err
}

func (r *RestaurantRepository) UpdateWorkingHours(restaurantID uint, workingHours []models.WorkingHour) error {
	// First delete existing working hours
	if err := r.db.Where("restaurant_id = ?", restaurantID).Delete(&models.WorkingHour{}).Error; err != nil {
		return err
	}

	// Then create new working hours
	for _, wh := range workingHours {
		wh.RestaurantID = restaurantID
		if err := r.db.Create(&wh).Error; err != nil {
			return err
		}
	}

	return nil
}

func (r *RestaurantRepository) GetWorkingHours(restaurantID uint) ([]models.WorkingHour, error) {
	var workingHours []models.WorkingHour
	err := r.db.Where("restaurant_id = ?", restaurantID).Order("day_of_week").Find(&workingHours).Error
	return workingHours, err
}

func (r *RestaurantRepository) FindAllRestaurantsByOwnerID(userID uint) ([]models.Restaurant, error) {
	var restaurants []models.Restaurant
	err := r.db.Where("user_id = ?", userID).Find(&restaurants).Error
	return restaurants, err
}
