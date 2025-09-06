package badges

import (
	"errors"

	"github.com/google/uuid"
	"github.com/supercakecrumb/chordik/internal/db"
	"gorm.io/gorm"
)

var (
	ErrBadgeNotFound = errors.New("badge not found")
)

type BadgeService struct {
	db *gorm.DB
}

func NewBadgeService(db *gorm.DB) *BadgeService {
	return &BadgeService{db: db}
}

const (
	BadgeNewcomer     = "NEWCOMER"
	BadgeContributorI = "CONTRIBUTOR_I"
	BadgeContributorV = "CONTRIBUTOR_V"
	BadgePopular100   = "POPULAR_100"
)

func (s *BadgeService) InitializeBadges() error {
	badges := []db.Badge{
		{Code: BadgeNewcomer, Name: "Newcomer", Description: "Awarded on first login"},
		{Code: BadgeContributorI, Name: "Contributor I", Description: "Awarded for 1 published song"},
		{Code: BadgeContributorV, Name: "Contributor V", Description: "Awarded for 5 published songs"},
		{Code: BadgePopular100, Name: "Popular", Description: "Awarded for a song with 100+ net votes"},
	}

	for _, badge := range badges {
		if err := s.db.FirstOrCreate(&badge, db.Badge{Code: badge.Code}).Error; err != nil {
			return err
		}
	}

	return nil
}

func (s *BadgeService) AwardBadge(userID uuid.UUID, badgeCode string) error {
	var badge db.Badge
	if err := s.db.First(&badge, "code = ?", badgeCode).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrBadgeNotFound
		}
		return err
	}

	// Check if user already has this badge
	var existing db.UserBadge
	if err := s.db.First(&existing, "user_id = ? AND badge_id = ?", userID, badge.ID).Error; err == nil {
		// Already has badge
		return nil
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	// Award badge
	userBadge := db.UserBadge{
		UserID:  userID,
		BadgeID: badge.ID,
	}

	return s.db.Create(&userBadge).Error
}

func (s *BadgeService) EvaluateNewcomerBadge(userID uuid.UUID) error {
	// This badge is awarded on first login, so just award it
	return s.AwardBadge(userID, BadgeNewcomer)
}

func (s *BadgeService) EvaluateContributorBadges(userID uuid.UUID) error {
	var count int64
	if err := s.db.Model(&db.Song{}).Where("created_by_id = ?", userID).Count(&count).Error; err != nil {
		return err
	}

	if count >= 1 {
		if err := s.AwardBadge(userID, BadgeContributorI); err != nil {
			return err
		}
	}

	if count >= 5 {
		if err := s.AwardBadge(userID, BadgeContributorV); err != nil {
			return err
		}
	}

	return nil
}

func (s *BadgeService) EvaluatePopularBadge(songID uuid.UUID) error {
	var song db.Song
	if err := s.db.First(&song, "id = ?", songID).Error; err != nil {
		return err
	}

	// Calculate score (likes - dislikes)
	var score int64
	if err := s.db.Model(&db.SongLike{}).
		Select("COALESCE(SUM(value), 0)").
		Where("song_id = ?", songID).
		Scan(&score).Error; err != nil {
		return err
	}

	if score >= 100 {
		return s.AwardBadge(song.CreatedByID, BadgePopular100)
	}

	return nil
}
