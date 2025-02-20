package repositories

import (
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"gorm.io/gorm"
)

type CustomerRepository struct {
	db *gorm.DB
}

func NewCustomerRepository(db *gorm.DB) CustomerRepository {
	return CustomerRepository{db: db}
}

func (r *CustomerRepository) FindAll() ([]models.User, error) {
	var customers []models.User
	err := r.db.Preload("Orders").Where("role = ?", "customer").Find(&customers).Error
	if err != nil {
		return nil, err
	}

	// Calculate additional fields for each customer
	for i := range customers {
		var lastOrder models.Order
		if err := r.db.Where("user_id = ?", customers[i].ID).Order("created_at desc").First(&lastOrder).Error; err == nil {
			customers[i].LastOrder = lastOrder.CreatedAt
		}

		var totalOrders int64
		r.db.Model(&models.Order{}).Where("user_id = ?", customers[i].ID).Count(&totalOrders)
		customers[i].TotalOrders = int(totalOrders)

		var totalSpent float64
		r.db.Model(&models.Order{}).Where("user_id = ?", customers[i].ID).Select("COALESCE(SUM(total_amount), 0)").Scan(&totalSpent)
		customers[i].TotalSpent = totalSpent
	}

	return customers, nil
}
