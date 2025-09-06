package db

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// PostgresConnection holds the database connection
type PostgresConnection struct {
	DB *gorm.DB
}

// NewPostgresConnection creates a new database connection
func NewPostgresConnection(host, user, password, dbname, port string) (*PostgresConnection, error) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		host, user, password, dbname, port)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Enable required extensions
	if err := db.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"").Error; err != nil {
		return nil, fmt.Errorf("failed to create uuid-ossp extension: %w", err)
	}

	if err := db.Exec("CREATE EXTENSION IF NOT EXISTS \"citext\"").Error; err != nil {
		return nil, fmt.Errorf("failed to create citext extension: %w", err)
	}

	return &PostgresConnection{DB: db}, nil
}

// Migrate runs database migrations for all models
func Migrate(db *gorm.DB) error {
	models := []interface{}{
		&User{},
		&Session{},
		&Song{},
		&SongLike{},
		&Badge{},
		&UserBadge{},
	}

	if err := db.AutoMigrate(models...); err != nil {
		return fmt.Errorf("failed to migrate models: %w", err)
	}

	return nil
}
