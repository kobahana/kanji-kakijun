"use client"

import { useState } from "react"
import { regions, type Region, type Prefecture } from "@/lib/prefecture-data"
import { RegionSidebar } from "@/components/region-sidebar"
import { PrefectureList } from "@/components/prefecture-list"
import { KanjiDisplay } from "@/components/kanji-display"
import { BookOpen, MapPin, List, PenLine } from "lucide-react"
import { cn } from "@/lib/utils"

type MobileTab = "region" | "pref" | "kanji"

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<Region>(regions[2])
  const [selectedPrefecture, setSelectedPrefecture] = useState<Prefecture | null>(
    regions[2].prefectures[5] // 東京都
  )
  const [mobileTab, setMobileTab] = useState<MobileTab>("kanji")

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region)
    setSelectedPrefecture(null)
    setMobileTab("pref")
  }

  const handlePrefectureSelect = (prefecture: Prefecture) => {
    setSelectedPrefecture(prefecture)
    setMobileTab("kanji")
  }

  return (
    <div className="h-[100dvh] overflow-hidden flex flex-col bg-background">
      {/* ── Header ── */}
      <header className="h-13 shrink-0 bg-card border-b border-border flex items-center px-4 lg:px-5 gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <BookOpen className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-foreground text-base leading-tight">
            都道府県の漢字学習
          </h1>
          <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
            とどうふけんのかんじがくしゅう
          </p>
        </div>
        <div className="hidden lg:block text-right shrink-0">
          <p className="text-xs text-muted-foreground">日本語を学ぶ留学生のための</p>
          <p className="text-[10px] text-muted-foreground/60">にほんごをまなぶひとたちのための</p>
        </div>
      </header>

      {/* ── Desktop: 3-column no-scroll layout ── */}
      <main className="hidden lg:flex flex-1 overflow-hidden gap-4 p-4">
        {/* Column 1: Region */}
        <div className="w-56 shrink-0 overflow-hidden">
          <RegionSidebar
            selectedRegion={selectedRegion}
            onSelectRegion={handleRegionSelect}
          />
        </div>
        {/* Column 2: Prefecture */}
        <div className="w-64 shrink-0 overflow-hidden">
          <PrefectureList
            region={selectedRegion}
            selectedPrefecture={selectedPrefecture}
            onSelectPrefecture={handlePrefectureSelect}
          />
        </div>
        {/* Column 3: Kanji */}
        <div className="flex-1 overflow-hidden">
          <KanjiDisplay prefecture={selectedPrefecture} />
        </div>
      </main>

      {/* ── Mobile: tab-based layout ── */}
      <div className="flex lg:hidden flex-col flex-1 overflow-hidden">
        {/* Content panel */}
        <div className="flex-1 overflow-hidden p-3">
          {mobileTab === "region" && (
            <RegionSidebar
              selectedRegion={selectedRegion}
              onSelectRegion={handleRegionSelect}
            />
          )}
          {mobileTab === "pref" && (
            <PrefectureList
              region={selectedRegion}
              selectedPrefecture={selectedPrefecture}
              onSelectPrefecture={handlePrefectureSelect}
            />
          )}
          {mobileTab === "kanji" && (
            <KanjiDisplay prefecture={selectedPrefecture} />
          )}
        </div>

        {/* Bottom tab bar */}
        <nav className="shrink-0 border-t border-border bg-card flex safe-bottom">
          {(
            [
              { id: "region" as MobileTab, Icon: MapPin,  label: "地方", sub: "ちほう" },
              { id: "pref"   as MobileTab, Icon: List,    label: "都道府県", sub: "とどうふけん" },
              { id: "kanji"  as MobileTab, Icon: PenLine, label: "書き順", sub: "かきじゅん" },
            ] as const
          ).map(({ id, Icon, label, sub }) => (
            <button
              key={id}
              onClick={() => setMobileTab(id)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors",
                mobileTab === id ? "text-accent" : "text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <div className="flex flex-col items-center leading-none">
                <span className="text-[11px] font-bold">{label}</span>
                <span className="text-[9px] mt-0.5 opacity-80">{sub}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
