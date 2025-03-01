package db

import (
	"fmt"
	"log/slog"
	"sync"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var (
	DB     *gorm.DB
	dbOnce sync.Once
)

// InitializeDB creates a new GORM DB connection
// func InitializeDB2() (*gorm.DB, error) {
// 	var err error

// 	// Use sync.Once to initialize the database connection only once
// 	dbOnce.Do(func() {
// 		conf := config.GetDBConfig()
// 		dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
// 			conf.Host, conf.User, conf.Password, conf.DBName, conf.Port, conf.SSLMode)

// 		DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
// 			Logger: logger.Default.LogMode(logger.Info),
// 		})
// 		if err != nil {
// 			slog.Error("Failed to connect to database", "error", err.Error())
// 		} else {
// 			slog.Info("Database connected successfully")
// 		}
// 	})

// 	if DB == nil {
// 		return nil, fmt.Errorf("failed to connect to database: %w", err)
// 	}

// 	return DB, nil
// }

// InitializeDB creates a new GORM DB connection
func InitializeDB() (*gorm.DB, error) {
	var err error

	// Use sync.Once to initialize the database connection only once
	dbOnce.Do(func() {
		// Update the DSN to use the SQLite file
		dsn := "./foodie.sqlite3"

		DB, err = gorm.Open(sqlite.Open(dsn), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})
		if err != nil {
			slog.Error("Failed to connect to database", "error", err.Error())
		} else {
			slog.Info("Database connected successfully")
		}
	})

	if DB == nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	return DB, nil
}

// CloseDB closes the GORM DB connection
func CloseDB(db *gorm.DB) {
	sqlDB, err := db.DB()
	if err != nil {
		slog.Error("Failed to get DB connection", "error", err.Error())
		return
	}
	if err := sqlDB.Close(); err != nil {
		slog.Error("Failed to close DB connection", "error", err.Error())
	}
}
