import { Song } from '../types'
import ChordProRenderer from './ChordProRenderer'
import { parseChordPro } from '../utils/chordProParser'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SongCard = ({ song }: { song: Song }) => {
  const [parsedLines, setParsedLines] = useState<ReturnType<typeof parseChordPro>>([])
  const navigate = useNavigate()

  useEffect(() => {
    // Parse the ChordPro content
    const lines = parseChordPro(song.BodyChordPro)
    setParsedLines(lines)
  }, [song.BodyChordPro])

  // Get only the first few lines for preview
  const previewLines = parsedLines.slice(0, 4)

  const handleClick = () => {
    navigate(`/songs/${song.ID}`)
  }

  return (
    <div
      className="bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-primary">{song.Title}</h3>
          <p className="text-muted">{song.Artist}</p>
        </div>
        {song.Key && (
          <span className="bg-gray-700 text-xs px-2 py-1 rounded">
            {song.Key}
          </span>
        )}
      </div>

      {/* ChordPro Preview */}
      <div className="mt-3 text-sm">
        <ChordProRenderer lines={previewLines} />
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-muted">
          Added by {song.CreatedBy.DisplayName}
        </span>
        <div className="flex items-center space-x-2">
          <button
            className="text-muted hover:text-secondary"
            onClick={(e) => e.stopPropagation()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <span className="font-medium">{song.score}</span>
          <button
            className="text-muted hover:text-secondary"
            onClick={(e) => e.stopPropagation()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SongCard