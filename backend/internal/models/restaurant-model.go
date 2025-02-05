package models

import (
	"time"

	"gorm.io/gorm"
)

type Restaurant struct {
	BaseModel
	Name        string  `json:"name" validate:"required"`
	Description string  `json:"description"`
	Address     string  `json:"address" validate:"required"`
	Phone       string  `json:"phone" validate:"required"`
	Email       string  `json:"email" validate:"required,email"`
	Rating      float32 `json:"rating" gorm:"default:0"`
	Image       string  `json:"image"`
	IsActive    bool    `json:"is_active" gorm:"default:true"`
	IsOpen      bool    `json:"is_open" gorm:"default:true"`
	UserID      uint    `json:"user_id,omitempty" gorm:"default:null;null"`
	CuisineID   uint    `json:"cuisine_id,omitempty" gorm:"default:null;null"`

	Cuisine   *Cuisine   `json:"cuisine,omitempty" gorm:"foreignKey:CuisineID"`
	User      *User      `json:"user,omitempty" gorm:"foreignKey:UserID"`
	MenuItems []MenuItem `json:"menu_items" gorm:"foreignKey:RestaurantID"`
}

func (Restaurant) BeforeCreate(tx *gorm.DB) (err error) {
	tx.Statement.SetColumn("CreatedAt", time.Now())
	tx.Statement.SetColumn("UpdatedAt", time.Now())
	return nil
}

func (Restaurant) BeforeUpdate(tx *gorm.DB) (err error) {
	tx.Statement.SetColumn("UpdatedAt", time.Now())
	return nil
}

type MenuItem struct {
	BaseModel
	Name         string  `json:"name" validate:"required"`
	Description  string  `json:"description"`
	Price        float64 `json:"price" validate:"required"`
	Image        string  `json:"image"`
	Category     string  `json:"category" validate:"required"`
	IsAvailable  bool    `json:"is_available" gorm:"default:true"`
	RestaurantID uint    `json:"restaurant_id"`
	CuisineID    uint    `json:"cuisine_id,omitempty" gorm:"default:null;null"`

	Cuisine    *Cuisine   `json:"cuisine,omitempty" gorm:"foreignKey:CuisineID"`
	Restaurant Restaurant `json:"restaurant,omitempty" gorm:"foreignKey:RestaurantID"`
}

func (MenuItem) BeforeCreate(tx *gorm.DB) (err error) {
	tx.Statement.SetColumn("CreatedAt", time.Now())
	tx.Statement.SetColumn("UpdatedAt", time.Now())
	return nil
}

func (MenuItem) BeforeUpdate(tx *gorm.DB) (err error) {
	tx.Statement.SetColumn("UpdatedAt", time.Now())
	return nil
}

type Order struct {
	BaseModel
	UserID          uint        `json:"user_id"`
	User            User        `json:"-" gorm:"foreignKey:UserID"`
	RestaurantID    uint        `json:"restaurant_id"`
	Restaurant      Restaurant  `json:"-" gorm:"foreignKey:RestaurantID"`
	Items           []OrderItem `json:"items" gorm:"foreignKey:OrderID"`
	TotalAmount     float64     `json:"total_amount"`
	Status          string      `json:"status" gorm:"default:'pending'"`
	DeliveryAddress string      `json:"delivery_address" binding:"required"`
	PaymentStatus   string      `json:"payment_status" gorm:"default:'pending'"`
	PaymentMethod   string      `json:"payment_method" binding:"required"`
}

func (Order) BeforeCreate(tx *gorm.DB) (err error) {
	tx.Statement.SetColumn("CreatedAt", time.Now())
	tx.Statement.SetColumn("UpdatedAt", time.Now())
	return nil
}

func (Order) BeforeUpdate(tx *gorm.DB) (err error) {
	tx.Statement.SetColumn("UpdatedAt", time.Now())
	return nil
}

type OrderItem struct {
	BaseModel
	OrderID    uint     `json:"order_id" gorm:"not null"`
	Order      Order    `json:"-" gorm:"foreignKey:OrderID"`
	MenuItemID uint     `json:"menu_item_id" gorm:"not null"`
	MenuItem   MenuItem `json:"menu_item" gorm:"foreignKey:MenuItemID"`
	Quantity   int      `json:"quantity" binding:"required"`
	Price      float64  `json:"price"`
}

func (OrderItem) BeforeCreate(tx *gorm.DB) (err error) {
	tx.Statement.SetColumn("CreatedAt", time.Now())
	tx.Statement.SetColumn("UpdatedAt", time.Now())
	return nil
}

func (OrderItem) BeforeUpdate(tx *gorm.DB) (err error) {
	tx.Statement.SetColumn("UpdatedAt", time.Now())
	return nil
}
