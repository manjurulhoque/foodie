package models

import (
	"time"

	"gorm.io/gorm"
)

type Cuisine struct {
	BaseModel
	Name        string `json:"name" validate:"required"`
	Description string `json:"description"`
	Image       string `json:"image"`
	IsActive    bool   `json:"is_active" gorm:"default:true"`
	IsPopular   bool   `json:"is_popular" gorm:"default:false"`
}

func (Cuisine) BeforeCreate(tx *gorm.DB) error {
	tx.Statement.SetColumn("CreatedAt", time.Now())
	tx.Statement.SetColumn("UpdatedAt", time.Now())
	return nil
}

func (Cuisine) BeforeUpdate(tx *gorm.DB) error {
	tx.Statement.SetColumn("UpdatedAt", time.Now())
	return nil
}
