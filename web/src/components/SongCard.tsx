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

  // Get only the first few lines for preview, excluding metadata
  const previewLines = parsedLines.filter(line => line.type !== 'metadata').slice(0, 4)

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
      </div>
    </div>
  )
}

export default SongCard