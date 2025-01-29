package models

import (
	"time"

	"gorm.io/gorm"
)

// BaseModel represents the common fields for all models
// @Description Base model with common fields
type BaseModel struct {
	ID        uint           `json:"id" gorm:"primarykey,autoIncrement" example:"1"`
	CreatedAt time.Time      `json:"created_at" example:"2024-01-29T17:57:19Z"`
	UpdatedAt time.Time      `json:"updated_at" example:"2024-01-29T17:57:19Z"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" swaggertype:"string" example:"2024-01-29T17:57:19Z"`
}

func (BaseModel) BeforeCreate(tx *gorm.DB) error {
	tx.Statement.SetColumn("CreatedAt", time.Now())
	tx.Statement.SetColumn("UpdatedAt", time.Now())
	return nil
}

func (BaseModel) BeforeUpdate(tx *gorm.DB) error {
	tx.Statement.SetColumn("UpdatedAt", time.Now())
	return nil
}
