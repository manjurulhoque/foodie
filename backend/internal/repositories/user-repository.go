package repositories

import (
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"gorm.io/gorm"
)

type UserRepository interface {
	CreateUser(user *models.User) error
	GetUserById(id uint) (*models.User, error)
	GetUserByEmail(email string) (*models.User, error)
	FindUserByEmail(email string) bool
	UpdateUser(uint, map[string]interface{}) error
	GetDB() *gorm.DB
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db}
}

func (r *userRepository) GetDB() *gorm.DB {
	return r.db
}

func (r *userRepository) CreateUser(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *userRepository) GetUserById(id uint) (*models.User, error) {
	var user models.User
	err := r.db.Where("id = ?", id).First(&user).Error
	return &user, err
}

func (r *userRepository) GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	return &user, err
}

func (r *userRepository) FindUserByEmail(email string) bool {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	return err == nil
}

func (r *userRepository) UpdateUser(userId uint, updates map[string]interface{}) error {
	return r.db.Model(&models.User{}).Where("id = ?", userId).Updates(updates).Error
}
