"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { fetchKanjiSvg } from "@/lib/kanji-api"
import { KanjiStroke } from "@/components/kanji-stroke"

/** Shown when SVG fetch fails. Calls onComplete() so the animation chain continues. */
function FallbackChar({
  char,
  size,
  animating,
  onComplete,
}: {
  char: string
  size: number
  animating: boolean
  onComplete: () => void
}) {
  useEffect(() => {
    if (!animating) return
    // Give a brief moment then advance the chain
    const t = setTimeout(onComplete, 600)
    return () => clearTimeout(t)
  }, [animating, onComplete])

  return (
    <span
      className="font-serif text-foreground/60"
      style={{ fontSize: size * 0.6 }}
    >
      {char}
    </span>
  )
}

interface KanjiCharCanvasProps {
  /** The kanji character to display (single char) */
  char: string
  /** True while this character is being actively animated */
  animating: boolean
  /** True when animation for this character is done (show static finished strokes) */
  done: boolean
  /** Called when all strokes for this character finish animating */
  onComplete: () => void
  /** Size in px of the SVG canvas */
  size?: number
  /** Stroke colour */
  strokeColor?: string
  /** Speed multiplier (1 = normal, 2 = 2x faster) */
  speedMultiplier?: number
}

/**
 * Fetches KanjiVG path data for a single kanji character and renders
 * all of its strokes, animating them in order when `animating === true`.
 */
export function KanjiCharCanvas({
  char,
  animating,
  done,
  onComplete,
  size = 200,
  strokeColor = "#1a365d",
  speedMultiplier = 1,
}: KanjiCharCanvasProps) {
  const [paths, setPaths] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  // Which stroke index is currently being animated (-1 = none)
  const [activeStroke, setActiveStroke] = useState<number>(-1)
  // Track whether we've already kicked off the animation for this run
  const hasStarted = useRef(false)
  // pendingStart: animating became true before paths were ready
  const pendingStart = useRef(false)

  // Fetch SVG paths whenever the character changes
  useEffect(() => {
    setLoading(true)
    setError(false)
    setPaths([])
    setActiveStroke(-1)
    hasStarted.current = false
    pendingStart.current = false

    fetchKanjiSvg(char).then((result) => {
      if (result.length === 0) {
        setError(true)
      } else {
        setPaths(result)
      }
      setLoading(false)
    })
  }, [char])

  // When animating turns true, either start immediately (paths ready)
  // or set a pending flag so we start as soon as paths arrive.
  useEffect(() => {
    if (!animating) {
      pendingStart.current = false
      return
    }
    if (paths.length > 0 && !hasStarted.current) {
      hasStarted.current = true
      setActiveStroke(0)
    } else {
      // paths not yet loaded — remember to start once they arrive
      pendingStart.current = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animating])

  // When paths arrive, check if we had a pending start request
  useEffect(() => {
    if (paths.length > 0 && pendingStart.current && !hasStarted.current) {
      pendingStart.current = false
      hasStarted.current = true
      setActiveStroke(0)
    }
  }, [paths])

  // Reset when animating becomes false
  useEffect(() => {
    if (!animating) {
      setActiveStroke(-1)
      hasStarted.current = false
    }
  }, [animating])

  const handleStrokeComplete = useCallback(
    (strokeIdx: number) => {
      const next = strokeIdx + 1
      if (next < paths.length) {
        // Brief pause between strokes for a natural rhythm
        setTimeout(() => setActiveStroke(next), 100)
      } else {
        // All strokes done — notify parent
        onComplete()
      }
    },
    [paths.length, onComplete]
  )

  const strokeDuration = (0.55) / speedMultiplier

  if (loading) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex items-center justify-center"
      >
        <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex items-center justify-center"
      >
        {/* Fallback: show plain text. Still call onComplete so animation chain continues. */}
        <FallbackChar char={char} size={size} animating={animating} onComplete={onComplete} />
      </div>
    )
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Light grid lines for reference */}
      <svg
        viewBox="0 0 109 109"
        width={size}
        height={size}
        className="absolute inset-0 pointer-events-none"
        aria-hidden
      >
        {/* Grid */}
        <line x1="54.5" y1="0" x2="54.5" y2="109" stroke="currentColor" strokeWidth="0.5" className="text-border" />
        <line x1="0" y1="54.5" x2="109" y2="54.5" stroke="currentColor" strokeWidth="0.5" className="text-border" />
        <line x1="0" y1="0" x2="109" y2="109" stroke="currentColor" strokeWidth="0.3" strokeDasharray="3,3" className="text-border/60" />
        <line x1="109" y1="0" x2="0" y2="109" stroke="currentColor" strokeWidth="0.3" strokeDasharray="3,3" className="text-border/60" />
        <rect x="1" y="1" width="107" height="107" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-border" />
      </svg>

      {/* Kanji strokes */}
      <svg
        viewBox="0 0 109 109"
        width={size}
        height={size}
        className="absolute inset-0"
      >
        {paths.map((pathData, idx) => {
          const isActive = idx === activeStroke
          // Show stroke if: it's the active one, already drawn, or char is fully done
          const isDoneStroke = done || idx < activeStroke
          const isVisible = isDoneStroke || isActive

          return (
            <KanjiStroke
              key={`${char}-stroke-${idx}`}
              pathData={pathData}
              strokeIndex={idx}
              totalStrokes={paths.length}
              strokeDuration={strokeDuration}
              // Always pass onComplete — KanjiStroke only calls it when animating
              onComplete={() => handleStrokeComplete(idx)}
              color={strokeColor}
              animating={isActive}
              visible={isVisible}
            />
          )
        })}
      </svg>
    </div>
  )
}
