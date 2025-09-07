# ChordPro Parser and Renderer Fixes

## Problem Description
The ChordPro parser was not correctly handling chords at the end of lines. Specifically:
1. Chords at the end of a line (e.g., `...волос[Bb]`) were not being recognized or rendered
2. They only rendered correctly when followed by text (e.g., `[Bb]волос`)
3. Root cause: the parser only flushed chords when there was trailing lyric text

## Fixes Implemented

### 1. Parser Update (`web/src/utils/chordProParser.ts`)

**Issue**: The parser wasn't flushing chords that appeared at the end of a line.

**Fix**: Added logic to push any remaining chord at the end of the line:

```typescript
// Push any remaining chord at end of line
if (currentChord) {
  segments.push({ chord: currentChord, lyric: '' })
}
```

**Location**: After line 63, before pushing the result.

### 2. Renderer Update (`web/src/components/ChordProRenderer.tsx`)

**Issue**: Chord tokens would collapse when lyrics were empty (minWidth: 0ch).

**Fix**: Ensured chord tokens have a minimum width of 1ch:

```typescript
style={{ minWidth: `${Math.max(segment.lyric.length, 1)}ch`, display: 'inline-block' }}
```

**Location**: Line 35, in the non-preview rendering section.

### 3. Test Cases Added (`web/src/utils/chordProParser.test.ts`)

Added two new test cases to verify the fixes:

1. **Chord at end of line**:
   ```typescript
   it('should parse chords at end of line', () => {
     const text = "я кутаюсь в мокрые пряди воло[Bb]"
     // Should produce: [{ chord: '', lyric: 'я кутаюсь в мокрые пряди воло' }, { chord: 'Bb', lyric: '' }]
   })
   ```

2. **Multiple chords including end-of-line**:
   ```typescript
   it('should handle multiple chords including end-of-line', () => {
     const text = "[F]Hello [Am]world[Bb]"
     // Should produce all three chords, including Bb at the end
   })
   ```

## Validation

The fixes ensure:
- Chords at the end of lines are properly parsed and rendered
- All existing functionality continues to work (regression test)
- Support for all chord types is maintained:
  - Accidentals (#, b)
  - Qualities (maj7, m, sus4)
  - Extensions (7, 9, 13)
  - Slash chords (G/B)
- Works in both full song view and preview mode

## Example Outputs

**Input**: `"я кутаюсь в мокрые пряди воло[Bb]"`
**Output**: 
```json
[
  { 
    "type": "chords",
    "content": [
      { "chord": "", "lyric": "я кутаюсь в мокрые пряди воло" },
      { "chord": "Bb", "lyric": "" }
    ]
  }
]
```

**Input**: `"[F]Hello [Am]world[Bb]"`
**Output**:
```json
[
  {
    "type": "chords",
    "content": [
      { "chord": "F", "lyric": "Hello " },
      { "chord": "Am", "lyric": "world" },
      { "chord": "Bb", "lyric": "" }
    ]
  }
]