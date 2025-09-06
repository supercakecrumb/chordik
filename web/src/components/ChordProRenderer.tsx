import { SongLine, ChordSegment } from '../utils/chordProParser'
import { ReactNode } from 'react'

interface ChordProRendererProps {
  lines: SongLine[]
}

const ChordProRenderer = ({ lines }: ChordProRendererProps) => {
  return (
    <div className="font-mono space-y-4">
      {lines.map((line, index) => {
        if (line.type === 'metadata') {
          // Don't render metadata lines
          return null
        }

        if (line.type === 'lyrics') {
          if (line.content === '') {
            return <div key={index} className="h-4"></div>
          }
          return (
            <div key={index} className="text-white">
              {line.content as string}
            </div>
          )
        }

        // Type guard for chord lines
        if (line.type === 'chords' && Array.isArray(line.content)) {
          return (
            <div key={index} className="space-y-1">
              {/* Chord line */}
              <div className="flex">
                {line.content.map((segment: ChordSegment, i) => (
                  <span 
                    key={i}
                    className="text-primary font-bold"
                    style={{ minWidth: `${segment.lyric.length}ch` }}
                  >
                    {segment.chord}
                  </span>
                ))}
              </div>
              
              {/* Lyric line */}
              <div className="text-white">
                {line.content.map((segment: ChordSegment, i) => (
                  <span key={i}>{segment.lyric}</span>
                ))}
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