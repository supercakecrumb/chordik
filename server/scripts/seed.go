package main

import (
	"fmt"
	"log"

	"github.com/supercakecrumb/chordik/internal/db"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Update these with your local PostgreSQL credentials
	dsn := "host=localhost user=postgres password=postgres dbname=postgres port=5432 sslmode=disable"
	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Create database if it doesn't exist
	database.Exec("CREATE DATABASE chordik_db;")

	// Connect to the new database
	dsn = "host=localhost user=postgres password=postgres dbname=chordik_db port=5432 sslmode=disable"
	database, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to chordik_db:", err)
	}

	// Auto migrate models
	if err := database.AutoMigrate(&db.User{}, &db.Session{}, &db.Song{}, &db.SongLike{}, &db.Badge{}, &db.UserBadge{}); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Create user
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("aurora"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("Failed to hash password:", err)
	}

	user := db.User{
		Email:        "aurora@example.com",
		PasswordHash: string(hashedPassword),
		DisplayName:  "aurora",
	}
	if err := database.Create(&user).Error; err != nil {
		log.Fatal("Failed to create user:", err)
	}

	// Create songs
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
		song := db.Song{
			Title:        s.title,
			Artist:       s.artist,
			BodyChordPro: s.chordpro,
			CreatedByID:  user.ID,
		}
		if err := database.Create(&song).Error; err != nil {
			log.Fatal("Failed to create song:", err)
		}
	}

	fmt.Println("Database seeded successfully")
}
