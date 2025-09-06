package auth

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/supercakecrumb/chordik/internal/badges"
	"github.com/supercakecrumb/chordik/internal/db"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var (
	ErrEmailTaken         = errors.New("email already taken")
	ErrInvalidCredentials = errors.New("invalid credentials")
)

type AuthService struct {
	db           *gorm.DB
	badgeService *badges.BadgeService
}

func NewAuthService(db *gorm.DB) *AuthService {
	return &AuthService{
		db:           db,
		badgeService: badges.NewBadgeService(db),
	}
}

func (s *AuthService) Register(email, password, displayName string) (*db.User, error) {
	// Check if email exists
	var existing db.User
	if err := s.db.Where("email = ?", email).First(&existing).Error; err == nil {
		return nil, ErrEmailTaken
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// Create user
	user := db.User{
		Email:        email,
		PasswordHash: string(hashedPassword),
		DisplayName:  displayName,
	}

	if err := s.db.Create(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *AuthService) Login(email, password string) (*db.User, error) {
	var user db.User
	if err := s.db.Where("email = ?", email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrInvalidCredentials
		}
		return nil, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, ErrInvalidCredentials
	}

	// Award newcomer badge on first login
	if err := s.badgeService.EvaluateNewcomerBadge(user.ID); err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *AuthService) CreateSession(userID uuid.UUID) (*db.Session, error) {
	session := db.Session{
		UserID:    userID,
		ExpiresAt: time.Now().Add(24 * time.Hour * 7), // 1 week
	}

	if err := s.db.Create(&session).Error; err != nil {
		return nil, err
	}

	return &session, nil
}

func (s *AuthService) DeleteSession(sessionID uuid.UUID) error {
	return s.db.Where("id = ?", sessionID).Delete(&db.Session{}).Error
}

func (s *AuthService) GetUserFromSession(sessionID uuid.UUID) (*db.User, error) {
	var session db.Session
	if err := s.db.Preload("User").Where("id = ? AND expires_at > ?", sessionID, time.Now()).First(&session).Error; err != nil {
		return nil, err
	}
	return &session.User, nil
}
