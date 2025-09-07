import { parseChordPro } from './chordProParser'

describe('ChordPro Parser', () => {
  it('should parse simple chord lines', () => {
    const text = "[G]Hello [D]world"
    const result = parseChordPro(text)
    
    expect(result).toEqual([
      {
        type: 'chords',
        content: [
          { chord: 'G', lyric: 'Hello ' },
          { chord: 'D', lyric: 'world' }
        ]
      }
    ])
  })

  it('should handle metadata', () => {
    const text = "{title: Test Song}\n{artist: Tester}"
    const result = parseChordPro(text)
    
    expect(result).toEqual([
      { type: 'metadata', content: 'title: Test Song' },
      { type: 'metadata', content: 'artist: Tester' }
    ])
  })

  it('should handle empty lines', () => {
    const text = "[G]Verse\n\n[D]Chorus"
    const result = parseChordPro(text)
    
    expect(result).toEqual([
      { 
        type: 'chords',
        content: [{ chord: 'G', lyric: 'Verse' }]
      },
      { type: 'lyrics', content: '' },
      { 
        type: 'chords',
        content: [{ chord: 'D', lyric: 'Chorus' }]
      }
    ])
  })

  it('should handle lyrics without chords', () => {
    const text = "Just lyrics no chords"
    const result = parseChordPro(text)
    
    expect(result).toEqual([
      {
        type: 'chords',
        content: [{ chord: '', lyric: 'Just lyrics no chords' }]
      }
    ])
  })

  it('should handle complex mixed lines', () => {
    const text = "[G]Hello [D]world, this [C]is a test"
    const result = parseChordPro(text)
    
    expect(result).toEqual([
      {
        type: 'chords',
        content: [
          { chord: 'G', lyric: 'Hello ' },
          { chord: 'D', lyric: 'world, this ' },
          { chord: 'C', lyric: 'is a test' }
        ]
      }
    ])
  })

  it('should parse chords at end of line', () => {
    const text = "я кутаюсь в мокрые пряди воло[Bb]"
    const result = parseChordPro(text)
    
    expect(result).toEqual([
      {
        type: 'chords',
        content: [
          { chord: '', lyric: 'я кутаюсь в мокрые пряди воло' },
          { chord: 'Bb', lyric: '' }
        ]
      }
    ])
  })

  it('should handle multiple chords including end-of-line', () => {
    const text = "[F]Hello [Am]world[Bb]"
    const result = parseChordPro(text)
    
    expect(result).toEqual([
      {
        type: 'chords',
        content: [
          { chord: 'F', lyric: 'Hello ' },
          { chord: 'Am', lyric: 'world' },
          { chord: 'Bb', lyric: '' }
        ]
      }
    ])
  })
})