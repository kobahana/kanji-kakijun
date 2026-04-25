"use client"

import { cn } from "@/lib/utils"
import { type Prefecture, type Region } from "@/lib/prefecture-data"

interface PrefectureListProps {
  region: Region
  selectedPrefecture: Prefecture | null
  onSelectPrefecture: (prefecture: Prefecture) => void
}

export function PrefectureList({
  region,
  selectedPrefecture,
  onSelectPrefecture,
}: PrefectureListProps) {
  return (
    <div className="h-full bg-card rounded-xl border border-border overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border shrink-0">
        <h3 className="font-semibold text-sm text-foreground">都道府県</h3>
        <p className="text-muted-foreground text-[10px] mt-0.5">
          {region.prefectures.length} とどうふけん
        </p>
      </div>

      {/* Scrollable single-column list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {region.prefectures.map((prefecture) => (
          <button
            key={prefecture.name}
            onClick={() => onSelectPrefecture(prefecture)}
            className={cn(
              "w-full px-4 py-3.5 rounded-lg border-2 transition-all duration-200",
              "hover:border-accent hover:bg-accent/5",
              "focus:outline-none focus:ring-2 focus:ring-ring",
              "flex items-center justify-between gap-3",
              selectedPrefecture?.name === prefecture.name
                ? "border-accent bg-accent/10 shadow-md translate-x-1"
                : "border-border"
            )}
          >
            <div className="flex flex-col items-start leading-tight">
              <span className="text-lg font-semibold text-foreground">
                {prefecture.name === "北海道" 
                  ? "北海道" 
                  : prefecture.name === "京都府"
                  ? "京都"
                  : prefecture.name.replace(/[県都府]$/, "")}
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5">
                {prefecture.name === "北海道"
                  ? "ほっかいどう"
                  : prefecture.name === "京都府"
                  ? "きょうと"
                  : prefecture.furigana.replace(/(けん|と|ふ)$/, "")}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
