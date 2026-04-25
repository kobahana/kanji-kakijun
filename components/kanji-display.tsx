"use client"

import { useState, useCallback, useEffect } from "react"
import { type Prefecture } from "@/lib/prefecture-data"
import { Button } from "@/components/ui/button"
import { KanjiCharCanvas } from "@/components/kanji-char-canvas"
import { Play, RotateCcw, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface KanjiDisplayProps {
  prefecture: Prefecture | null
}

type AnimState = "idle" | "playing" | "done"

export function KanjiDisplay({ prefecture }: KanjiDisplayProps) {
  const [animState, setAnimState] = useState<AnimState>("idle")
  const [currentCharIdx, setCurrentCharIdx] = useState<number>(-1)
  const [doneChars, setDoneChars] = useState<Set<number>>(new Set())
  
  // Initialize with a consistent value to avoid hydration mismatch.
  // We'll update it to the real innerWidth after mounting.
  const [windowWidth, setWindowWidth] = useState(1200)

  useEffect(() => {
    // Only access window.innerWidth after component mounts on the client
    setWindowWidth(window.innerWidth)
    
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    setAnimState("idle")
    setCurrentCharIdx(-1)
    setDoneChars(new Set())
  }, [prefecture])

  const playAnimation = useCallback(() => {
    if (!prefecture || animState === "playing") return
    setAnimState("playing")
    setCurrentCharIdx(0)
    setDoneChars(new Set())
  }, [prefecture, animState])

  const playSpecificChar = useCallback((charIdx: number) => {
    if (!prefecture || animState === "playing") return
    setAnimState("playing")
    setCurrentCharIdx(charIdx)
    // Mark previous characters as done
    const prevDone = new Set<number>()
    for (let i = 0; i < charIdx; i++) {
      prevDone.add(i)
    }
    setDoneChars(prevDone)
  }, [prefecture, animState])

  const resetAnimation = useCallback(() => {
    setAnimState("idle")
    setCurrentCharIdx(-1)
    setDoneChars(new Set())
  }, [])

  const handleCharComplete = useCallback(
    (charIdx: number) => {
      if (!prefecture) return
      setDoneChars((prev) => new Set([...prev, charIdx]))
      const next = charIdx + 1
      if (next < prefecture.characters.length) {
        setTimeout(() => setCurrentCharIdx(next), 300)
      } else {
        setAnimState("done")
        setCurrentCharIdx(-1)
      }
    },
    [prefecture]
  )

  /* ── Empty state ── */
  if (!prefecture) {
    return (
      <div className="h-full bg-card rounded-xl border border-border flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <span className="text-3xl text-muted-foreground">漢</span>
          </div>
          <h3 className="text-base font-medium text-foreground mb-1">
            とどうふけんをえらんでください
          </h3>
          <p className="text-sm text-muted-foreground">
            えらんだ都道府県の漢字がここにでます
          </p>
        </div>
      </div>
    )
  }

  /* ── Main UI ── */
  const chars = prefecture.characters
  const isMobile = windowWidth < 768

  // Calculate canvasSize dynamically
  // Desktop: Large fixed sizes
  // Mobile: Divide available width (minus padding/gaps) by char count
  let canvasSize = 180
  if (isMobile) {
    const padding = 48 // p-6 total
    const gaps = (chars.length - 1) * 8
    const available = windowWidth - padding - gaps
    canvasSize = Math.min(130, Math.floor(available / chars.length))
  } else {
    canvasSize = chars.length >= 4 ? 200 : chars.length === 3 ? 240 : chars.length === 2 ? 280 : 320
  }

  return (
    <div className="h-full bg-card rounded-xl border border-border overflow-hidden flex flex-col">
      {/* Card header bar */}
      <div className="bg-primary/5 border-b border-border px-4 py-2.5 shrink-0 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">べんきょうちゅう</span>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-accent/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-accent/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-accent/20" />
        </div>
      </div>

      {/* Body — centralized container for all content */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col items-center justify-center p-4 sm:p-10 gap-6 sm:gap-10">

        {/* Top section: furigana + canvases */}
        <div className="flex flex-col items-center justify-center gap-4 sm:gap-10 min-h-0">
          {/* Furigana */}
          <p className="text-sm sm:text-3xl text-primary/70 tracking-[0.4em] sm:tracking-[0.8em] font-sans text-center">
            {prefecture.furigana}
          </p>

          {/* Canvas row — NO WRAPPING on mobile to keep them in one line */}
          <div className="flex flex-nowrap items-center justify-center gap-2 sm:gap-4">
            {chars.map((char, charIdx) => {
              const isAnimating = currentCharIdx === charIdx
              const isDone = doneChars.has(charIdx)
              const isIdle = animState === "idle"

              return (
                <motion.div
                  key={`${prefecture.name}-char-${charIdx}`}
                  className="flex flex-col items-center gap-1"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: charIdx * 0.06 }}
                >
                  {/* Canvas box */}
                  <div
                    className={cn(
                      "relative rounded-xl border-2 transition-all duration-300 overflow-hidden",
                      isIdle
                        ? "border-border bg-muted/20"
                        : isAnimating
                        ? "border-accent shadow-md shadow-accent/20"
                        : isDone
                        ? "border-primary/40 bg-primary/5"
                        : "border-border bg-muted/10"
                    )}
                    style={{ width: canvasSize, height: canvasSize }}
                  >
                    {/* Idle: plain text over grid */}
                    {isIdle && (
                      <>
                        <svg
                          viewBox="0 0 109 109"
                          width={canvasSize}
                          height={canvasSize}
                          className="absolute inset-0 pointer-events-none"
                          aria-hidden
                        >
                          <line x1="54.5" y1="0" x2="54.5" y2="109" stroke="currentColor" strokeWidth="0.5" className="text-border" />
                          <line x1="0" y1="54.5" x2="109" y2="54.5" stroke="currentColor" strokeWidth="0.5" className="text-border" />
                          <rect x="1" y="1" width="107" height="107" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-border" />
                        </svg>
                        <span
                          className="absolute inset-0 flex items-center justify-center font-serif text-foreground"
                          style={{ fontSize: canvasSize * 0.62 }}
                        >
                          {char}
                        </span>
                      </>
                    )}

                    {/* SVG stroke animation */}
                    {!isIdle && (
                      <KanjiCharCanvas
                        char={char}
                        animating={isAnimating}
                        done={isDone}
                        onComplete={() => handleCharComplete(charIdx)}
                        size={canvasSize}
                        strokeColor={
                          isAnimating ? "oklch(0.55 0.18 25)" : "oklch(0.35 0.08 250)"
                        }
                      />
                    )}
                  </div>

                  {/* Status badge below canvas */}
                  <div className="h-6 flex items-center justify-center">
                    {isAnimating && (
                      <span className="flex items-center gap-1.5 text-[10px] sm:text-xs text-accent font-medium bg-accent/5 px-2 py-0.5 rounded-full">
                        <Loader2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-spin" />
                        かきじゅう...
                      </span>
                    )}
                    {isDone && animState !== "idle" && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-[10px] sm:text-xs text-primary/60 font-medium"
                      >
                        ✓ おわり
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Completion banner */}
          {animState === "done" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                🎉 かんせい！じょうずにかけました。
              </span>
            </motion.div>
          )}
        </div>

        {/* Bottom section: buttons + breakdown */}
        <div className="flex flex-col gap-4 sm:gap-10 pb-2 sm:pb-0">
          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 px-2 sm:px-0">
            <Button
              onClick={playAnimation}
              disabled={animState === "playing"}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 sm:px-10 py-4 sm:py-7 h-auto gap-2 sm:gap-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-60 text-base sm:text-lg rounded-xl sm:rounded-2xl flex-1 sm:flex-initial"
            >
              {animState === "playing" ? (
                <>
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                  <span className="text-sm sm:text-lg">さいせいちゅう...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                  <span className="text-sm sm:text-lg">かきじゅんをみる</span>
                </>
              )}
            </Button>

            {(animState === "playing" || animState === "done") && (
              <Button
                variant="outline"
                onClick={resetAnimation}
                className="px-4 sm:px-6 py-4 sm:py-7 h-auto gap-2 text-base sm:text-lg rounded-xl sm:rounded-2xl border-2"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-lg">はじめから</span>
              </Button>
            )}
          </div>

          {/* Character breakdown — interactive */}
          <div className="pt-2 sm:pt-4 border-t border-border">
            <p className="text-[10px] sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-4 text-center">
              かんじをえらんで スタートできます
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
              {chars.map((char, index) => (
                <button
                  key={index}
                  onClick={() => playSpecificChar(index)}
                  disabled={animState === "playing"}
                  className={cn(
                    "flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl border-2 transition-all duration-300",
                    "hover:border-accent hover:bg-accent/5 disabled:hover:border-border disabled:hover:bg-transparent",
                    animState === "idle"
                      ? "border-border bg-card"
                      : doneChars.has(index)
                      ? "border-accent bg-accent/5"
                      : currentCharIdx === index
                      ? "border-accent/60 bg-accent/10 animate-pulse"
                      : "border-border bg-muted/30"
                  )}
                  title={`${char}からスタート`}
                >
                  <span className="text-xl sm:text-3xl font-serif">{char}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
