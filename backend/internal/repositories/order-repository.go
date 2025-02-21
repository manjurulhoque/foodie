package repositories

import (
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"gorm.io/gorm"
)

type OrderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) OrderRepository {
	return OrderRepository{db: db}
}

func (r *OrderRepository) Create(order *models.Order) error {
	return r.db.Create(order).Error
}

func (r *OrderRepository) FindByID(id uint) (*models.Order, error) {
	var order models.Order
	err := r.db.Preload("Items").Preload("Items.MenuItem").First(&order, id).Error
	if err != nil {
		return nil, err
	}
	return &order, nil
}

func (r *OrderRepository) FindByUser(userID uint) ([]models.Order, error) {
	var orders []models.Order
	err := r.db.Preload("Items").Preload("Items.MenuItem").Where("user_id = ?", userID).Find(&orders).Error
	return orders, err
}

func (r *OrderRepository) FindByRestaurant(restaurantID uint) ([]models.Order, error) {
	var orders []models.Order
	err := r.db.Preload("Items").Preload("Items.MenuItem").Where("restaurant_id = ?", restaurantID).Find(&orders).Error
	return orders, err
}

func (r *OrderRepository) Update(order *models.Order) error {
	return r.db.Save(order).Error
}

func (r *OrderRepository) UpdateStatus(id uint, status string) error {
	return r.db.Model(&models.Order{}).Where("id = ?", id).Update("status", status).Error
}

func (r *OrderRepository) UpdatePaymentStatus(id uint, status string) error {
	return r.db.Model(&models.Order{}).Where("id = ?", id).Update("payment_status", status).Error
}

func (r *OrderRepository) FindAll() ([]models.Order, error) {
	var orders []models.Order
	err := r.db.Preload("User").Preload("Restaurant").Preload("Items").Preload("Items.MenuItem").Find(&orders).Error
	return orders, err
}
