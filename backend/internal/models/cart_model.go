package models

import (
	"time"

	"gorm.io/gorm"
)

type Cart struct {
	BaseModel
	UserID uint       `json:"user_id" gorm:"not null"`
	User   User       `json:"-" gorm:"foreignKey:UserID"`
	Items  []CartItem `json:"items" gorm:"foreignKey:CartID"`
}

type CartItem struct {
	BaseModel
	CartID     uint     `json:"cart_id" gorm:"not null"`
	Cart       Cart     `json:"-" gorm:"foreignKey:CartID"`
	MenuItemID uint     `json:"menu_item_id" gorm:"not null"`
	MenuItem   MenuItem `json:"menu_item" gorm:"foreignKey:MenuItemID"`
	Quantity   int      `json:"quantity" gorm:"not null;default:1"`
}

func (Cart) BeforeCreate(tx *gorm.DB) error {
	tx.Statement.SetColumn("CreatedAt", time.Now())
	tx.Statement.SetColumn("UpdatedAt", time.Now())
	return nil
}

func (Cart) BeforeUpdate(tx *gorm.DB) error {
	tx.Statement.SetColumn("UpdatedAt", time.Now())
	return nil
}

func (CartItem) BeforeCreate(tx *gorm.DB) error {
	tx.Statement.SetColumn("CreatedAt", time.Now())
	tx.Statement.SetColumn("UpdatedAt", time.Now())
	return nil
}

func (CartItem) BeforeUpdate(tx *gorm.DB) error {
	tx.Statement.SetColumn("UpdatedAt", time.Now())
	return nil
}
