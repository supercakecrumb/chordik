package songs

import (
	"errors"

	"github.com/google/uuid"
	"github.com/supercakecrumb/chordik/internal/badges"
	"github.com/supercakecrumb/chordik/internal/db"
	"gorm.io/gorm"
)

var (
	ErrSongNotFound     = errors.New("song not found")
	ErrPermissionDenied = errors.New("permission denied")
	ErrInvalidChordPro  = errors.New("invalid chordpro format")
)

type SongService struct {
	db           *gorm.DB
	badgeService *badges.BadgeService
}

func NewSongService(db *gorm.DB) *SongService {
	return &SongService{
		db:           db,
		badgeService: badges.NewBadgeService(db),
	}
}

func (s *SongService) CreateSong(userID uuid.UUID, title, artist, bodyChordPro, key string) (*db.Song, error) {
	if !isValidChordPro(bodyChordPro) {
		return nil, ErrInvalidChordPro
	}

	song := db.Song{
		Title:        title,
		Artist:       artist,
		BodyChordPro: bodyChordPro,
		Key:          key,
		CreatedByID:  userID,
	}

	if err := s.db.Create(&song).Error; err != nil {
		return nil, err
	}

	// Evaluate contributor badges after song creation
	if err := s.badgeService.EvaluateContributorBadges(userID); err != nil {
		return nil, err
	}

	return &song, nil
}

func (s *SongService) GetSong(id uuid.UUID) (*db.Song, error) {
	var song db.Song
	if err := s.db.Preload("CreatedBy").First(&song, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrSongNotFound
		}
		return nil, err
	}
	return &song, nil
}

func (s *SongService) UpdateSong(userID, songID uuid.UUID, title, artist, bodyChordPro, key string) (*db.Song, error) {
	var song db.Song
	if err := s.db.First(&song, "id = ?", songID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrSongNotFound
		}
		return nil, err
	}

	// Check ownership
	if song.CreatedByID != userID {
		return nil, ErrPermissionDenied
	}

	if !isValidChordPro(bodyChordPro) {
		return nil, ErrInvalidChordPro
	}

	updates := map[string]interface{}{
		"title":          title,
		"artist":         artist,
		"body_chord_pro": bodyChordPro,
		"key":            key,
	}

	if err := s.db.Model(&song).Updates(updates).Error; err != nil {
		return nil, err
	}

	return &song, nil
}

func (s *SongService) DeleteSong(userID, songID uuid.UUID) error {
	var song db.Song
	if err := s.db.First(&song, "id = ?", songID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrSongNotFound
		}
		return err
	}

	// Check ownership
	if song.CreatedByID != userID {
		return ErrPermissionDenied
	}

	return s.db.Delete(&song).Error
}

func (s *SongService) ListSongs(offset, limit int, search string) ([]db.Song, int64, error) {
	var songs []db.Song
	var total int64

	query := s.db.Model(&db.Song{}).Preload("CreatedBy").Order("created_at DESC")

	if search != "" {
		query = query.Where("title ILIKE ? OR artist ILIKE ?", "%"+search+"%", "%"+search+"%")
	}

	// Get total count
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results
	if err := query.Offset(offset).Limit(limit).Find(&songs).Error; err != nil {
		return nil, 0, err
	}

	return songs, total, nil
}

// Basic ChordPro format validation
func isValidChordPro(body string) bool {
	// TODO: Implement more robust validation
	return len(body) > 0 && len(body) < 65536 // Basic length check
}
