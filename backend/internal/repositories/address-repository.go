package repositories

import (
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"gorm.io/gorm"
)

type AddressRepository struct {
	db *gorm.DB
}

func NewAddressRepository(db *gorm.DB) AddressRepository {
	return AddressRepository{db: db}
}

func (r *AddressRepository) Create(address *models.Address) error {
	if address.IsDefault {
		// If this is default, unset other default addresses for this user
		r.db.Model(&models.Address{}).Where("user_id = ?", address.UserID).Update("is_default", false)
	}
	return r.db.Create(address).Error
}

func (r *AddressRepository) Update(id uint, address map[string]interface{}) error {
	if isDefault, ok := address["is_default"].(bool); ok && isDefault {
		// If setting as default, unset other default addresses for this user
		r.db.Model(&models.Address{}).Where("user_id = ?", address["user_id"]).Update("is_default", false)
	}
	return r.db.Model(&models.Address{}).Where("id = ?", id).Updates(address).Error
}

func (r *AddressRepository) Delete(id uint) error {
	return r.db.Delete(&models.Address{}, id).Error
}

func (r *AddressRepository) FindByUser(userID uint) ([]models.Address, error) {
	var addresses []models.Address
	err := r.db.Where("user_id = ?", userID).Find(&addresses).Error
	return addresses, err
}

func (r *AddressRepository) FindByID(id uint) (*models.Address, error) {
	var address models.Address
	err := r.db.First(&address, id).Error
	return &address, err
}
