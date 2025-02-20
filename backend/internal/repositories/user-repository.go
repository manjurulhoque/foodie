package repositories

import (
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"gorm.io/gorm"
)

type UserRepository interface {
	CreateUser(user *models.User) error
	GetUserById(id uint) (*models.User, error)
	GetUserByEmail(email string) (*models.User, error)
	EmailExists(email string) bool
	UpdateUser(uint, map[string]interface{}) error
	GetDB() *gorm.DB
	FindAllUsers() ([]models.PublicUser, error)
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

func (r *userRepository) EmailExists(email string) bool {
	var exists bool
	r.db.Model(&models.User{}).Select("count(*) > 0").Where("email = ?", email).Find(&exists)
	return exists
}

func (r *userRepository) UpdateUser(userId uint, updates map[string]interface{}) error {
	return r.db.Model(&models.User{}).Where("id = ?", userId).Updates(updates).Error
}

func (r *userRepository) FindAllUsers() ([]models.PublicUser, error) {
	var users []models.PublicUser
	err := r.db.Model(&models.User{}).Find(&users).Error
	return users, err
}
