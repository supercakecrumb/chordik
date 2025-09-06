package db

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Email        string    `gorm:"type:citext;unique;not null"`
	PasswordHash string    `gorm:"type:text;not null"`
	DisplayName  string    `gorm:"type:text;unique;not null"`
	CreatedAt    time.Time `gorm:"autoCreateTime"`
	UpdatedAt    time.Time `gorm:"autoUpdateTime"`
}

type Session struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UserID    uuid.UUID `gorm:"type:uuid;not null"`
	User      User      `gorm:"foreignKey:UserID"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	ExpiresAt time.Time `gorm:"not null"`
}

type Song struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Title        string    `gorm:"type:text;not null;index"`
	Artist       string    `gorm:"type:text;not null;index"`
	BodyChordPro string    `gorm:"type:text;not null"`
	Key          string    `gorm:"type:text"`
	CreatedByID  uuid.UUID `gorm:"type:uuid;not null"`
	CreatedBy    User      `gorm:"foreignKey:CreatedByID"`
	CreatedAt    time.Time `gorm:"autoCreateTime"`
	UpdatedAt    time.Time `gorm:"autoUpdateTime"`
}

type SongLike struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	SongID    uuid.UUID `gorm:"type:uuid;not null;uniqueIndex:idx_song_user"`
	UserID    uuid.UUID `gorm:"type:uuid;not null;uniqueIndex:idx_song_user"`
	Value     int16     `gorm:"not null"` // +1 for like, -1 for dislike
	CreatedAt time.Time `gorm:"autoCreateTime"`
}

type Badge struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Code        string    `gorm:"type:text;unique;not null"`
	Name        string    `gorm:"type:text;not null"`
	Description string    `gorm:"type:text;not null"`
}

type UserBadge struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UserID    uuid.UUID `gorm:"type:uuid;not null;index"`
	BadgeID   uuid.UUID `gorm:"type:uuid;not null"`
	AwardedAt time.Time `gorm:"autoCreateTime"`
}
