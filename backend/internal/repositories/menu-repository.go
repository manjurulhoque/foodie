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

func (r *MenuRepository) FindAll() ([]models.MenuItem, error) {
	var menuItems []models.MenuItem
	err := r.db.Find(&menuItems).Error
	return menuItems, err
}

func (r *MenuRepository) Create(menuItem *models.MenuItem) error {
	return r.db.Create(menuItem).Error
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

func (r *MenuRepository) Update(menuItem *models.MenuItem) error {
	return r.db.Save(menuItem).Error
}

func (r *MenuRepository) Delete(id uint) error {
	return r.db.Delete(&models.MenuItem{}, id).Error
}

func (r *MenuRepository) FindByCategory(restaurantID uint, category string) ([]models.MenuItem, error) {
	var menuItems []models.MenuItem
	err := r.db.Where("restaurant_id = ? AND category = ?", restaurantID, category).Find(&menuItems).Error
	return menuItems, err
}
