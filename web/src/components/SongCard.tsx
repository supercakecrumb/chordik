import { Song } from '../types'
import ChordProRenderer from './ChordProRenderer'
import { parseChordPro } from '../utils/chordProParser'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from './ui/Card'

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
    <Card
      className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-trans-blue to-trans-pink">
            {song.Title}
          </h3>
          <p className="text-ink-300">{song.Artist}</p>
        </div>
        {song.Key && (
          <span className="bg-base-600 text-xs px-2 py-1 rounded">
            {song.Key}
          </span>
        )}
      </div>

      {/* ChordPro Preview */}
      <div className="mt-3 text-sm">
        <ChordProRenderer lines={previewLines} preview={true} />
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-ink-300">
          Added by <span className="gradient-text">{song.CreatedBy.DisplayName}</span>
        </span>
      </div>
    </Card>
  )
}

export default SongCard