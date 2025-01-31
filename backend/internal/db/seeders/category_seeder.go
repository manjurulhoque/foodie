package seeders

import (
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"gorm.io/gorm"
)

var categories = []models.Category{
	{
		Name:        "Appetizers",
		Description: "Starters and small plates to begin your meal",
		IsActive:    true,
	},
	{
		Name:        "Main Course",
		Description: "Primary dishes and entrees",
		IsActive:    true,
	},
	{
		Name:        "Desserts",
		Description: "Sweet treats and dessert options",
		IsActive:    true,
	},
	{
		Name:        "Beverages",
		Description: "Drinks and refreshments",
		IsActive:    true,
	},
	{
		Name:        "Salads",
		Description: "Fresh and healthy salad options",
		IsActive:    true,
	},
	{
		Name:        "Soups",
		Description: "Hot and cold soup selections",
		IsActive:    true,
	},
	{
		Name:        "Sides",
		Description: "Complementary dishes and side orders",
		IsActive:    true,
	},
	{
		Name:        "Breakfast",
		Description: "Morning meals and breakfast items",
		IsActive:    true,
	},
	{
		Name:        "Specials",
		Description: "Chef's special dishes and seasonal items",
		IsActive:    true,
	},
	{
		Name:        "Vegetarian",
		Description: "Meat-free and plant-based options",
		IsActive:    true,
	},
}

func SeedCategories(db *gorm.DB) error {
	// Delete all existing categories first
	if err := db.Exec("DELETE FROM categories").Error; err != nil {
		return err
	}
	for _, category := range categories {
		var existingCategory models.Category
		if err := db.Where("name = ?", category.Name).First(&existingCategory).Error; err == gorm.ErrRecordNotFound {
			if err := db.Create(&category).Error; err != nil {
				return err
			}
		}
	}
	return nil
}