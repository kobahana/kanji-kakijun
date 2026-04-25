"use client"

import { useEffect, useRef, useState } from "react"
import { motion, animate, useMotionValue } from "framer-motion"

interface KanjiStrokeProps {
  /** The SVG path `d` attribute for this single stroke */
  pathData: string
  /** Index of this stroke among all strokes in this character (0-based) */
  strokeIndex: number
  /** Total number of strokes in this character */
  totalStrokes: number
  /** Seconds per stroke drawing */
  strokeDuration?: number
  /** Called when this stroke's animation is complete */
  onComplete?: () => void
  /** The stroke colour */
  color?: string
  /** Whether this stroke is currently being animated */
  animating: boolean
  /** Whether the stroke should be visible at all */
  visible: boolean
}

/**
 * Renders a single SVG stroke and animates it using the
 * stroke-dasharray / stroke-dashoffset technique via Framer Motion.
 */
export function KanjiStroke({
  pathData,
  strokeIndex,
  strokeDuration = 0.6,
  onComplete,
  color = "currentColor",
  animating,
  visible,
}: KanjiStrokeProps) {
  const measureRef = useRef<SVGPathElement>(null)
  const [pathLength, setPathLength] = useState(0)
  const [showNumber, setShowNumber] = useState(false)
  const [numberPos, setNumberPos] = useState({ x: 0, y: 0 })
  const dashOffset = useMotionValue(0)
  const [readyToAnimate, setReadyToAnimate] = useState(false)

  // Measure path length after mount
  useEffect(() => {
    if (measureRef.current) {
      const len = measureRef.current.getTotalLength()
      setPathLength(len)
      
      // CRITICAL: If this is the active stroke, hide it immediately after measurement
      // to prevent the 1-frame "flash" of the full line.
      if (animating) {
        dashOffset.set(len)
      }
      
      const pt = measureRef.current.getPointAtLength(0)
      setNumberPos({ x: pt.x, y: pt.y })

      // Mark as ready so we can safely show the animating path
      setReadyToAnimate(true)
    }
  }, [pathData, animating, dashOffset])

  // Reset ready state when path data changes
  useEffect(() => {
    setReadyToAnimate(false)
  }, [pathData])

  // Holds the framer-motion animation controls so we can stop on cleanup
  const animControls = useRef<{ stop: () => void } | null>(null)

  // Run the drawing animation when this stroke becomes active
  useEffect(() => {
    if (!animating || pathLength === 0 || !readyToAnimate) return

    // 1. Show the number badge immediately at the stroke start-point
    setShowNumber(true)
    dashOffset.set(pathLength)

    // 2. Brief pause so the user sees the number, then draw the stroke
    const pauseTimer = setTimeout(() => {
      animControls.current = animate(dashOffset, 0, {
        duration: strokeDuration,
        ease: "easeInOut",
        onComplete: () => {
          // 3. Badge disappears once the stroke is fully drawn
          setShowNumber(false)
          onComplete?.()
        },
      })
    }, 380)

    return () => {
      clearTimeout(pauseTimer)
      animControls.current?.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animating, pathLength, strokeDuration, readyToAnimate])

  // Hide number badge when no longer animating
  useEffect(() => {
    if (!animating) setShowNumber(false)
  }, [animating])

  // Always render the measuring path so getTotalLength() works when stroke becomes active.
  // Only conditionally render the visual elements.
  return (
    <g>
      {/* Hidden measuring path — always in DOM regardless of visibility */}
      <path
        ref={measureRef}
        d={pathData}
        fill="none"
        stroke="transparent"
        strokeWidth={0}
      />

      {/* Skip visual rendering when not visible */}
      {visible && (
        <>
          {/* Finished static stroke */}
          {!animating && (
            <path
              d={pathData}
              fill="none"
              stroke={color}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Animated drawing stroke */}
          {animating && pathLength > 0 && readyToAnimate && (
            <motion.path
              d={pathData}
              fill="none"
              stroke={color}
              strokeWidth={3.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: pathLength,
                strokeDashoffset: dashOffset,
              }}
            />
          )}

          {/* Stroke-order number badge at the starting point */}
          {showNumber && animating && (
            <g>
              <circle cx={numberPos.x} cy={numberPos.y} r={8} fill="#e85c3a" opacity={0.9} />
              <text
                x={numberPos.x}
                y={numberPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={8}
                fill="white"
                fontWeight="bold"
                style={{ userSelect: "none" }}
              >
                {strokeIndex + 1}
              </text>
            </g>
          )}
        </>
      )}
    </g>
  )
}
