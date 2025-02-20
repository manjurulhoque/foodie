package models

import (
	"time"
)

const (
	RoleCustomer        = "customer"
	RoleRestaurantOwner = "restaurant_owner"
	RoleRestaurantStaff = "restaurant_staff"
	RoleAdmin           = "admin"
	RoleModerator       = "moderator"
)

type User struct {
	BaseModel
	Email           string    `json:"email" gorm:"unique;not null" validate:"required,email"`
	Name            string    `json:"name" gorm:"not null" validate:"required"`
	Password        string    `json:"-" gorm:"not null" validate:"required,min=6"`
	Phone           string    `json:"phone" gorm:"unique;not null" validate:"required"`
	Role            string    `json:"role" gorm:"not null" gorm:"default:user"`
	Image           string    `json:"image"`
	IsActive        bool      `json:"is_active" gorm:"default:true"`
	IsEmailVerified bool      `json:"is_email_verified" gorm:"default:false"`
	LastLoginAt     time.Time `json:"last_login_at"`
	Address         string    `json:"address"`
	Orders          []Order   `json:"orders" gorm:"foreignKey:UserID"`
	LastOrder       time.Time `json:"last_order" gorm:"-"`
	TotalOrders     int       `json:"total_orders" gorm:"-"`
	TotalSpent      float64   `json:"total_spent" gorm:"-"`

	// New fields for multi-restaurant functionality
	DeliveryAddresses []Address `json:"delivery_addresses" gorm:"foreignKey:UserID"`
}

func (u *User) TableName() string {
	return "users"
}

type PublicUser struct {
	Id        uint      `json:"id"`
	Name      string    `json:"name"`
	Image     string    `json:"image"`
	Email     string    `json:"email"`
	Phone     string    `json:"phone"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
	IsActive  bool      `json:"is_active"`
}

func (u *PublicUser) TableName() string {
	return "users"
}

// New struct for delivery addresses
type Address struct {
	BaseModel
	UserID     uint   `json:"user_id" gorm:"not null"`
	Label      string `json:"label" gorm:"not null"` // e.g., "Home", "Work"
	Street     string `json:"street" gorm:"not null"`
	City       string `json:"city" gorm:"not null"`
	State      string `json:"state" gorm:"not null"`
	PostalCode string `json:"postal_code" gorm:"not null"`
	IsDefault  bool   `json:"is_default" gorm:"default:false"`
}
