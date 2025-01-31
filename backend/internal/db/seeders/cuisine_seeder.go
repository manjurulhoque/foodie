package seeders

import (
	"github.com/manjurulhoque/foodie/backend/internal/models"
	"gorm.io/gorm"
)

var cuisines = []models.Cuisine{
	{
		Name:        "Italian",
		Description: "Traditional Italian cuisine known for pasta, pizza, and Mediterranean flavors",
		IsActive:    true,
	},
	{
		Name:        "Chinese",
		Description: "Diverse regional cuisines featuring stir-fries, dumplings, and rice dishes",
		IsActive:    true,
	},
	{
		Name:        "Japanese",
		Description: "Refined cuisine featuring sushi, ramen, and traditional washoku dishes",
		IsActive:    true,
	},
	{
		Name:        "Indian",
		Description: "Rich and diverse cuisine known for curries, tandoor dishes, and spices",
		IsActive:    true,
	},
	{
		Name:        "Mexican",
		Description: "Vibrant cuisine with tacos, enchiladas, and traditional Latin flavors",
		IsActive:    true,
	},
	{
		Name:        "Thai",
		Description: "Aromatic cuisine balancing sweet, sour, spicy, and savory flavors",
		IsActive:    true,
	},
	{
		Name:        "French",
		Description: "Sophisticated cuisine known for fine dining and classic techniques",
		IsActive:    true,
	},
	{
		Name:        "Mediterranean",
		Description: "Healthy cuisine featuring olive oil, fresh vegetables, and seafood",
		IsActive:    true,
	},
	{
		Name:        "Korean",
		Description: "Bold cuisine featuring kimchi, barbecue, and fermented dishes",
		IsActive:    true,
	},
	{
		Name:        "Vietnamese",
		Description: "Fresh cuisine with herbs, rice noodles, and balanced flavors",
		IsActive:    true,
	},
	{
		Name:        "Greek",
		Description: "Traditional Mediterranean cuisine with olive oil, feta, and grilled meats",
		IsActive:    true,
	},
	{
		Name:        "Spanish",
		Description: "Diverse cuisine known for tapas, paella, and Mediterranean influences",
		IsActive:    true,
	},
	{
		Name:        "Middle Eastern",
		Description: "Rich cuisine featuring hummus, kebabs, and aromatic spices",
		IsActive:    true,
	},
	{
		Name:        "American",
		Description: "Diverse cuisine featuring burgers, barbecue, and fusion dishes",
		IsActive:    true,
	},
	{
		Name:        "Brazilian",
		Description: "Flavorful South American cuisine with grilled meats and tropical ingredients",
		IsActive:    true,
	},
	{
		Name:        "Turkish",
		Description: "Rich cuisine blending Middle Eastern and Mediterranean flavors",
		IsActive:    true,
	},
	{
		Name:        "Lebanese",
		Description: "Mediterranean cuisine known for mezze, grilled meats, and fresh ingredients",
		IsActive:    true,
	},
	{
		Name:        "Moroccan",
		Description: "North African cuisine with tagines, couscous, and aromatic spices",
		IsActive:    true,
	},
}

func SeedCuisines(db *gorm.DB) error {
	// Delete all existing cuisines first
	if err := db.Exec("DELETE FROM cuisines").Error; err != nil {
		return err
	}

	for _, cuisine := range cuisines {
		var existingCuisine models.Cuisine
		if err := db.Where("name = ?", cuisine.Name).First(&existingCuisine).Error; err == gorm.ErrRecordNotFound {
			if err := db.Create(&cuisine).Error; err != nil {
				return err
			}
		}
	}
	return nil
}
