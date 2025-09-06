package main

import (
	"fmt"
	"log"
	"os"

	"github.com/supercakecrumb/chordik/internal/db"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	// Connect to the database
	// Use environment variables if available, otherwise use default values for Docker
	host := getEnv("DB_HOST", "db")
	user := getEnv("DB_USER", "chordik")
	password := getEnv("DB_PASSWORD", "chordikpass")
	dbname := getEnv("DB_NAME", "chordik_db")
	port := getEnv("DB_PORT", "5432")

	database, err := db.NewPostgresConnection(host, user, password, dbname, port)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Check if admin user already exists
	var adminUser db.User
	result := database.DB.Where("email = ?", "admin@example.com").First(&adminUser)

	// If admin user doesn't exist, create it
	if result.Error != nil {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin"), bcrypt.DefaultCost)
		if err != nil {
			log.Fatal("Failed to hash password:", err)
		}

		adminUser = db.User{
			Email:        "admin@example.com",
			PasswordHash: string(hashedPassword),
			DisplayName:  "Administrator",
		}
		if err := database.DB.Create(&adminUser).Error; err != nil {
			log.Fatal("Failed to create user:", err)
		}
		fmt.Println("Admin user created successfully")
	} else {
		fmt.Println("Admin user already exists")
	}

	// Create songs if they don't exist
	songData := []struct {
		title    string
		artist   string
		chordpro string
	}{
		{"Imagine", "John Lennon", "{title:Imagine}\n{artist:John Lennon}\n[C]Imagine [F]all the people\n[G]Living life in [C]peace"},
		{"Hallelujah", "Leonard Cohen", "{title:Hallelujah}\n{artist:Leonard Cohen}\n[C]I heard there was a [F]secret chord\n[G]That David played and [C]it pleased the Lord"},
		{"Wonderwall", "Oasis", "{title:Wonderwall}\n{artist:Oasis}\n[Em]Today is gonna be the [G]day\n[D]That they're gonna throw it [A]back to you"},
	}

	for _, s := range songData {
		var existingSong db.Song
		result := database.DB.Where("title = ? AND artist = ?", s.title, s.artist).First(&existingSong)

		// If song doesn't exist, create it
		if result.Error != nil {
			song := db.Song{
				Title:        s.title,
				Artist:       s.artist,
				BodyChordPro: s.chordpro,
				CreatedByID:  adminUser.ID,
			}
			if err := database.DB.Create(&song).Error; err != nil {
				log.Fatal("Failed to create song:", err)
			}
			fmt.Printf("Song '%s' by '%s' created successfully\n", s.title, s.artist)
		} else {
			fmt.Printf("Song '%s' by '%s' already exists\n", s.title, s.artist)
		}
	}

	fmt.Println("Database seeded successfully")
}

// getEnv returns the value of an environment variable or a default value if not set
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
