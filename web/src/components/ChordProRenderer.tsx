import { SongLine, ChordSegment } from '../utils/chordProParser'

interface ChordProRendererProps {
  lines: SongLine[]
  preview?: boolean
}

const ChordProRenderer = ({ lines, preview = false }: ChordProRendererProps) => {
  // normalize helpers
  const normalizeLyric = (s: string) => s.replace(/\t/g, '    ');
  const collapseSpaces = (s: string) => s.replace(/\s{2,}/g, ' ');

  // Function to render chord tokens with proper spacing
  const renderChordTokens = (segments: ChordSegment[]) => {
    return segments.map((segment: ChordSegment, i) => {
      let segText = normalizeLyric(segment.lyric);
      if (preview) {
        segText = collapseSpaces(segText);
        if (i === 0) segText = segText.replace(/^\s+/, '');
        const cols = Math.max(1, Math.min(8, segText.length));
        return (
          <span
            key={i}
            className="chord-token"
            style={{ display: 'inline-block', minWidth: `${cols}ch` }}
          >
            {segment.chord}
          </span>
        );
      } else {
        return (
          <span
            key={i}
            className="chord-token"
            style={{ minWidth: `${segment.lyric.length}ch`, display: 'inline-block' }}
          >
            {segment.chord}
          </span>
        );
      }
    });
  };

  // Function to render lyric line
  const renderLyricLine = (segments: ChordSegment[]) => {
    let text = segments.map(s => normalizeLyric(s.lyric)).join('');
    if (preview) text = collapseSpaces(text);
    return <span>{text}</span>;
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
          
          // Handle lyric lines
          let raw = normalizeLyric(line.content as string);
          if (preview) raw = collapseSpaces(raw);
          return (
            <div key={index} className={`lyric-row ${preview ? 'preview-line--truncate' : ''}`}>
              {raw}
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