package seeders

import (
	"log/slog"

	"gorm.io/gorm"
)

func Seed(db *gorm.DB) error {
	// Add cuisine seeder
	if err := SeedCuisines(db); err != nil {
		slog.Error("Error seeding cuisines", "error", err.Error())
		return err
	}
	
	// Add restaurant seeder
	if err := SeedRestaurants(db); err != nil {
		slog.Error("Error seeding restaurants", "error", err.Error())
		return err
	}

	// Add category seeder
	if err := SeedCategories(db); err != nil {
		slog.Error("Error seeding categories", "error", err.Error())
		return err
	}

	return nil
}
