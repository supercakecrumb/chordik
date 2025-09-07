import { SongLine, ChordSegment } from '../utils/chordProParser'

interface ChordProRendererProps {
  lines: SongLine[]
  preview?: boolean
}

const ChordProRenderer = ({ lines, preview = false }: ChordProRendererProps) => {
  // Function to render chord tokens with proper spacing
  const renderChordTokens = (segments: ChordSegment[]) => {
    return segments.map((segment: ChordSegment, i) => (
      <span
        key={i}
        className="chord-token"
        style={{ minWidth: `${segment.lyric.length}ch`, display: 'inline-block' }}
      >
        {segment.chord}
      </span>
    ));
  };

  // Function to render lyric line
  const renderLyricLine = (segments: ChordSegment[]) => {
    return segments.map((segment: ChordSegment, i) => (
      <span key={i}>{segment.lyric}</span>
    ));
  };

  return (
    <div className="chord-sheet">
      {lines.map((line, index) => {
        if (line.type === 'metadata') {
          // Don't render metadata lines
          return null
        }

        if (line.type === 'lyrics') {
          if (line.content === '') {
            return <div key={index} className="h-4"></div>
          }
          // Section headings (Verse/Chorus)
          if (typeof line.content === 'string' &&
              (line.content.startsWith('[Verse') || line.content.startsWith('[Chorus') || line.content.startsWith('['))) {
            return (
              <div key={index} className="chord-section">
                {line.content}
              </div>
            )
          }
          return (
            <div key={index} className={`lyric-row ${preview ? 'preview-line--truncate' : ''}`}>
              {line.content as string}
            </div>
          )
        }

        // Type guard for chord lines
        if (line.type === 'chords' && Array.isArray(line.content)) {
          return (
            <div key={index} className="chord-line">
              {/* Chord line */}
              <div className="chord-row">
                {renderChordTokens(line.content)}
              </div>
              
              {/* Lyric line */}
              <div className={`lyric-row ${preview ? 'preview-line--truncate' : ''}`}>
                {renderLyricLine(line.content)}
              </div>
            </div>
          )
        }

        return null
      })}
    </div>
  )
}

export default ChordProRenderer