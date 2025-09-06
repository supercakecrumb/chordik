package votes

import (
	"errors"

	"github.com/google/uuid"
	"github.com/supercakecrumb/chordik/internal/badges"
	"github.com/supercakecrumb/chordik/internal/db"
	"gorm.io/gorm"
)

var (
	ErrSongNotFound = errors.New("song not found")
)

type VoteService struct {
	db           *gorm.DB
	badgeService *badges.BadgeService
}

func NewVoteService(db *gorm.DB) *VoteService {
	return &VoteService{
		db:           db,
		badgeService: badges.NewBadgeService(db),
	}
}

// VoteValue represents the possible vote values (+1 for like, -1 for dislike, 0 to remove vote)
type VoteValue int8

const (
	VoteLike    VoteValue = 1
	VoteDislike VoteValue = -1
	VoteRemove  VoteValue = 0
)

func (s *VoteService) Vote(userID, songID uuid.UUID, value VoteValue) (int64, error) {
	// Check if song exists
	var song db.Song
	if err := s.db.First(&song, "id = ?", songID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return 0, ErrSongNotFound
		}
		return 0, err
	}

	// Check if user already voted
	var existingVote db.SongLike
	err := s.db.Where("song_id = ? AND user_id = ?", songID, userID).First(&existingVote).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		// New vote
		if value == VoteRemove {
			return 0, nil
		}

		vote := db.SongLike{
			SongID: songID,
			UserID: userID,
			Value:  int16(value),
		}

		if err := s.db.Create(&vote).Error; err != nil {
			return 0, err
		}
	} else if err == nil {
		// Existing vote
		if value == VoteRemove {
			// Remove vote
			if err := s.db.Delete(&existingVote).Error; err != nil {
				return 0, err
			}
		} else {
			// Update vote
			existingVote.Value = int16(value)
			if err := s.db.Save(&existingVote).Error; err != nil {
				return 0, err
			}
		}
	} else {
		return 0, err
	}

	// Calculate new score
	var score int64
	if err := s.db.Model(&db.SongLike{}).
		Select("COALESCE(SUM(value), 0)").
		Where("song_id = ?", songID).
		Scan(&score).Error; err != nil {
		return 0, err
	}

	// Evaluate popular badge if score reaches threshold
	if score >= 100 || score <= -100 {
		if err := s.badgeService.EvaluatePopularBadge(songID); err != nil {
			return 0, err
		}
	}

	return score, nil
}

func (s *VoteService) GetUserVote(userID, songID uuid.UUID) (VoteValue, error) {
	var vote db.SongLike
	if err := s.db.Where("song_id = ? AND user_id = ?", songID, userID).First(&vote).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return VoteRemove, nil
		}
		return VoteRemove, err
	}
	return VoteValue(vote.Value), nil
}

func (s *VoteService) GetSongScore(songID uuid.UUID) (int64, error) {
	var score int64
	if err := s.db.Model(&db.SongLike{}).
		Select("COALESCE(SUM(value), 0)").
		Where("song_id = ?", songID).
		Scan(&score).Error; err != nil {
		return 0, err
	}
	return score, nil
}
