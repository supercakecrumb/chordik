package main

import (
	"fmt"
	"log"
	"os"

	"github.com/supercakecrumb/chordik/internal/badges"
	"github.com/supercakecrumb/chordik/internal/db"
	"github.com/supercakecrumb/chordik/internal/http"
)

func main() {
	// Initialize database connection
	database, err := db.NewPostgresConnection(
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Initialize badges
	badgeService := badges.NewBadgeService(database.DB)
	if err := badgeService.InitializeBadges(); err != nil {
		log.Fatalf("Failed to initialize badges: %v", err)
	}

	// Initialize HTTP server
	server := http.NewServer(database.DB)

	port := "8080"
	if p := os.Getenv("PORT"); p != "" {
		port = p
	}

	fmt.Printf("Starting server on :%s\n", port)
	if err := server.Run(":" + port); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
