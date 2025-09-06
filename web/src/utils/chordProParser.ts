export interface ChordSegment {
  chord: string
  lyric: string
}

export interface SongLine {
  type: 'chords' | 'lyrics' | 'metadata'
  content: string | ChordSegment[]
}

export function parseChordPro(text: string): SongLine[] {
  const lines = text.split('\n')
  const result: SongLine[] = []

  for (const line of lines) {
    if (line.startsWith('{') && line.endsWith('}')) {
      // Metadata line like {title: Song Title}
      result.push({
        type: 'metadata',
        content: line.slice(1, -1)
      })
    } else if (line.trim() === '') {
      // Empty line
      result.push({
        type: 'lyrics',
        content: ''
      })
    } else {
      // Chord/lyric line
      const segments: ChordSegment[] = []
      let currentChord = ''
      let currentLyric = ''
      let inChord = false

      for (let i = 0; i < line.length; i++) {
        const char = line[i]

        if (char === '[') {
          inChord = true
          // Push previous lyric if any
          if (currentLyric) {
            segments.push({ chord: '', lyric: currentLyric })
            currentLyric = ''
          }
        } else if (char === ']' && inChord) {
          inChord = false
          // The next characters will be lyrics for this chord
        } else if (inChord) {
          currentChord += char
        } else {
          if (currentChord) {
            segments.push({ chord: currentChord, lyric: char })
            currentChord = ''
          } else {
            currentLyric += char
          }
        }
      }

      // Push any remaining lyric
      if (currentLyric) {
        segments.push({ chord: '', lyric: currentLyric })
      }

      result.push({
        type: 'chords',
        content: segments
      })
    }
  }

  return result
}