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
	UserID      *uint   `json:"user_id" gorm:"default:null;null"`

	Cuisines     []*Cuisine     `json:"cuisines" gorm:"many2many:restaurant_cuisines;"`
	User         *User          `json:"user,omitempty" gorm:"foreignKey:UserID"`
	MenuItems    []MenuItem     `json:"menu_items" gorm:"foreignKey:RestaurantID"`
	WorkingHours []*WorkingHour `json:"working_hours" gorm:"foreignKey:RestaurantID"`
	Orders       []*Order        `json:"orders" gorm:"foreignKey:RestaurantID"`
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
	User            User        `json:"user,omitempty" gorm:"foreignKey:UserID"`
	RestaurantID    uint        `json:"restaurant_id"`
	Restaurant      Restaurant  `json:"restaurant,omitempty" gorm:"foreignKey:RestaurantID"`
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

type WorkingHour struct {
	BaseModel
	RestaurantID uint       `json:"restaurant_id" gorm:"not null"`
	Restaurant   Restaurant `json:"-" gorm:"foreignKey:RestaurantID"`
	DayOfWeek    int        `json:"day_of_week" gorm:"not null"` // 0 = Sunday, 6 = Saturday
	OpenTime     string     `json:"open_time" gorm:"not null"`   // Format: "HH:MM"
	CloseTime    string     `json:"close_time" gorm:"not null"`  // Format: "HH:MM"
	IsClosed     bool       `json:"is_closed" gorm:"default:false"`
}

func (WorkingHour) TableName() string {
	return "working_hours"
}

func (WorkingHour) BeforeCreate(tx *gorm.DB) (err error) {
	tx.Statement.SetColumn("CreatedAt", time.Now())
	tx.Statement.SetColumn("UpdatedAt", time.Now())
	return nil
}

func (WorkingHour) BeforeUpdate(tx *gorm.DB) (err error) {
	tx.Statement.SetColumn("UpdatedAt", time.Now())
	return nil
}

type OrderStatusHistory struct {
	BaseModel
	OrderID     uint      `json:"order_id" gorm:"not null"`
	Status      string    `json:"status" gorm:"not null"`
	Description string    `json:"description"`
	Order       *Order    `json:"order,omitempty" gorm:"foreignKey:OrderID"`
}

func (OrderStatusHistory) TableName() string {
	return "order_status_histories"
}

func (OrderStatusHistory) BeforeCreate(tx *gorm.DB) (err error) {
	tx.Statement.SetColumn("CreatedAt", time.Now())
	tx.Statement.SetColumn("UpdatedAt", time.Now())
	return nil
}
