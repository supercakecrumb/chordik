import { SongLine, ChordSegment } from '../utils/chordProParser'
import { useEffect, useRef, useCallback, useMemo } from 'react'

interface ChordProRendererProps {
  lines: SongLine[]
  preview?: boolean
  autoFit?: boolean
  maxFontSize?: number
  minFontSize?: number
  stepSize?: number // Deprecated - kept for compatibility but not used in binary search
}

const ChordProRenderer = ({
  lines,
  preview = false,
  autoFit = false,
  maxFontSize = 15,
  minFontSize = 8,
  stepSize = 0.5 // Not used in binary search but kept for API compatibility
}: ChordProRendererProps) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const isMeasuringRef = useRef(false);
  const sizeCache = useRef<Map<number, number>>(new Map()); // width -> optimal font size
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
        const isLast = i === segments.length - 1;
        // Width "until next lyric character" + tail for last token
        const reserveCh = segment.lyric.length + (isLast ? segment.chord.length : 0);
        
        return (
          <span
            key={i}
            className="chord-token"
            style={{ minWidth: `${Math.max(reserveCh, 1)}ch`, display: 'inline-block' }}
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

  /**
   * Binary search auto-fit implementation to prevent oscillation/jumping.
   *
   * Why binary search: Avoids the feedback loop caused by ResizeObserver triggering
   * on every font size change. We measure off-DOM or with observer disconnected.
   *
   * Why mute observer: Prevents nested callbacks during measurement phase.
   *
   * How we avoid thrashing: Single final size application + width-based caching.
   */

  // Simple debounce utility
  const debounce = useCallback(<T extends (...args: any[]) => any>(func: T, wait: number) => {
    let timeout: NodeJS.Timeout | null = null;
    
    const debounced = ((...args: any[]) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    }) as T & { cancel: () => void };
    
    debounced.cancel = () => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
    };
    
    return debounced;
  }, []);

  // Create hidden measuring container for off-DOM measurement
  const createMeasuringContainer = useCallback((originalContainer: HTMLElement): HTMLElement => {
    const clone = originalContainer.cloneNode(true) as HTMLElement;
    
    // Get rounded width to avoid sub-pixel issues
    const containerRect = originalContainer.getBoundingClientRect();
    const roundedWidth = Math.round(containerRect.width);
    
    // Make it invisible but maintain layout for accurate measurement
    clone.style.position = 'fixed';
    clone.style.top = '-9999px';
    clone.style.left = '-9999px';
    clone.style.visibility = 'hidden';
    clone.style.pointerEvents = 'none';
    clone.style.width = `${roundedWidth}px`;
    clone.style.height = 'auto';
    clone.style.overflow = 'visible';
    clone.style.contain = 'layout'; // Optimize layout performance
    clone.style.fontVariantLigatures = 'none'; // Disable ligatures for stable metrics
    
    document.body.appendChild(clone);
    return clone;
  }, []);

  // Measurement function with dual detection methods
  const checkForWrapping = useCallback((container: HTMLElement): boolean => {
    // SSR safety check
    if (typeof window === 'undefined') return false;
    
    // Check both chord and lyric rows to catch chord overflow
    const rows = container.querySelectorAll<HTMLElement>('.lyric-row, .chord-row');
    
    for (const row of rows) {
      // Primary method: scrollWidth vs clientWidth
      if (row.scrollWidth > row.clientWidth) {
        return true;
      }
      
      // Fallback method: height-based detection
      const computedStyle = window.getComputedStyle(row);
      const lineHeight = parseFloat(computedStyle.lineHeight);
      const actualHeight = row.getBoundingClientRect().height;
      
      // Allow small tolerance for rounding errors
      if (actualHeight > lineHeight * 1.1) {
        return true;
      }
    }
    
    return false;
  }, []);

  // Binary search to find optimal font size
  const findOptimalFontSize = useCallback(async (containerWidth: number): Promise<number> => {
    // Check cache first
    if (sizeCache.current.has(containerWidth)) {
      return sizeCache.current.get(containerWidth)!;
    }

    if (!sheetRef.current) return maxFontSize;

    // Wait for fonts to be ready to avoid measurement shifts
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    // Create off-DOM measuring container
    const measuringContainer = createMeasuringContainer(sheetRef.current);
    
    let low = minFontSize;
    let high = maxFontSize;
    let optimalSize = minFontSize;

    try {
      // Binary search for the largest size that doesn't wrap
      while (low <= high) {
        const mid = Math.round((low + high) * 10) / 20; // Round to 0.5px increments
        
        // Apply candidate size to measuring container
        measuringContainer.style.setProperty('--chord-line-size', `${mid}px`);
        
        // Force layout recalculation
        measuringContainer.offsetHeight;
        
        // Check if this size causes wrapping
        if (checkForWrapping(measuringContainer)) {
          // Size too large, try smaller
          high = mid - 0.5;
        } else {
          // Size fits, try larger
          optimalSize = mid;
          low = mid + 0.5;
        }
      }
    } finally {
      // Clean up measuring container
      document.body.removeChild(measuringContainer);
    }

    // Cache the result
    sizeCache.current.set(containerWidth, optimalSize);
    
    return optimalSize;
  }, [maxFontSize, minFontSize, createMeasuringContainer, checkForWrapping]);

  // Stable auto-shrink with binary search
  const performAutoShrink = useCallback(async () => {
    // SSR safety check
    if (typeof window === 'undefined' || !sheetRef.current || !autoFit) return;
    
    // Prevent concurrent measurements
    if (isMeasuringRef.current) return;
    isMeasuringRef.current = true;

    try {
      const container = sheetRef.current;
      // Use rounded width to avoid sub-pixel cache thrashing
      const containerRect = container.getBoundingClientRect();
      const roundedWidth = Math.round(containerRect.width);
      
      // Skip if width hasn't changed and we have a cached result
      if (sizeCache.current.has(roundedWidth)) {
        const cachedSize = sizeCache.current.get(roundedWidth)!;
        container.style.setProperty('--chord-line-size', `${cachedSize}px`);
        return;
      }

      // Temporarily disconnect observer to prevent feedback loop
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }

      // Find optimal size using binary search
      const optimalSize = await findOptimalFontSize(roundedWidth);
      
      // Apply the final size only once
      container.style.setProperty('--chord-line-size', `${optimalSize}px`);

      // Reconnect observer after a brief delay
      if (resizeObserverRef.current && autoFit) {
        setTimeout(() => {
          if (resizeObserverRef.current && sheetRef.current) {
            resizeObserverRef.current.observe(sheetRef.current);
          }
        }, 50);
      }
    } finally {
      isMeasuringRef.current = false;
    }
  }, [autoFit, findOptimalFontSize]);

  // Debounced resize handler with queue management
  const debouncedResize = useMemo(() => {
    const debouncedFn = debounce(performAutoShrink, 150);
    
    // Wrap to ignore calls while measuring
    const wrappedFn = () => {
      if (!isMeasuringRef.current) {
        debouncedFn();
      }
    };
    
    // Add cancel method to wrapped function
    (wrappedFn as any).cancel = debouncedFn.cancel;
    
    return wrappedFn as (() => void) & { cancel: () => void };
  }, [performAutoShrink, debounce]);

  // Clear cache when content changes
  useEffect(() => {
    if (autoFit) {
      sizeCache.current.clear();
    }
  }, [lines, autoFit]);

  // ResizeObserver setup
  useEffect(() => {
    // SSR safety check
    if (typeof window === 'undefined' || typeof ResizeObserver === 'undefined') return;
    
    if (!autoFit || !sheetRef.current) return;

    const resizeObserver = new ResizeObserver(debouncedResize);
    resizeObserverRef.current = resizeObserver;
    resizeObserver.observe(sheetRef.current);

    // Also listen for orientation changes
    const handleOrientationChange = () => {
      setTimeout(debouncedResize, 100); // Small delay for orientation settle
    };

    window.addEventListener('orientationchange', handleOrientationChange);

    // Initial check
    performAutoShrink();

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      window.removeEventListener('orientationchange', handleOrientationChange);
      debouncedResize.cancel();
    };
  }, [autoFit, debouncedResize, performAutoShrink]);

  return (
    <div ref={sheetRef} className="chord-sheet">
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