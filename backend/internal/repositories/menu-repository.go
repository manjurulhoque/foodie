package repositories

import (
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"gorm.io/gorm"
)

type MenuRepository struct {
	db *gorm.DB
}

func NewMenuRepository(db *gorm.DB) MenuRepository {
	return MenuRepository{db: db}
}

func (r *MenuRepository) FindAllPaginated(page int, limit int) ([]models.MenuItem, int64, error) {
	var menuItems []models.MenuItem
	var total int64

	offset := (page - 1) * limit
	err := r.db.Offset(offset).Limit(limit).Find(&menuItems).Error
	if err != nil {
		return nil, 0, err
	}

	if err := r.db.Model(&models.MenuItem{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	return menuItems, total, nil
}

func (r *MenuRepository) Create(menuItem map[string]interface{}) error {
	return r.db.Model(&models.MenuItem{}).Create(menuItem).Error
}

func (r *MenuRepository) FindByID(id uint) (*models.MenuItem, error) {
	var menuItem models.MenuItem
	err := r.db.First(&menuItem, id).Error
	if err != nil {
		return nil, err
	}
	return &menuItem, nil
}

func (r *MenuRepository) FindByRestaurant(restaurantID uint) ([]models.MenuItem, error) {
	var menuItems []models.MenuItem
	err := r.db.Where("restaurant_id = ?", restaurantID).Find(&menuItems).Error
	return menuItems, err
}

func (r *MenuRepository) Update(id uint, menuItem map[string]interface{}) (*models.MenuItem, error) {
	var updatedMenuItem models.MenuItem
	err := r.db.Model(&models.MenuItem{}).Where("id = ?", id).Updates(menuItem).Error
	return &updatedMenuItem, err
}

func (r *MenuRepository) Delete(id uint) error {
	return r.db.Delete(&models.MenuItem{}, id).Error
}

func (r *MenuRepository) FindByCategory(restaurantID uint, category string) ([]models.MenuItem, error) {
	var menuItems []models.MenuItem
	err := r.db.Where("restaurant_id = ? AND category = ?", restaurantID, category).Find(&menuItems).Error
	return menuItems, err
}
