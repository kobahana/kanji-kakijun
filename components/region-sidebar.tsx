"use client"

import { cn } from "@/lib/utils"
import { regions, type Region } from "@/lib/prefecture-data"
import { MapPin } from "lucide-react"

interface RegionSidebarProps {
  selectedRegion: Region
  onSelectRegion: (region: Region) => void
}

export function RegionSidebar({ selectedRegion, onSelectRegion }: RegionSidebarProps) {
  return (
    <div className="h-full bg-sidebar text-sidebar-foreground rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-sidebar-border shrink-0">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-accent shrink-0" />
          <h2 className="font-semibold text-sm">地方を選択</h2>
        </div>
        <p className="text-sidebar-foreground/60 text-xs mt-0.5">Select Region</p>
      </div>

      {/* Scrollable list */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {regions.map((region) => (
          <button
            key={region.id}
            onClick={() => onSelectRegion(region)}
            className={cn(
              "w-full text-left px-4 py-3 rounded-lg transition-all duration-200",
              "hover:bg-sidebar-accent hover:translate-x-1",
              "focus:outline-none focus:ring-2 focus:ring-sidebar-ring",
              "border-l-[4px]",
              selectedRegion.id === region.id
                ? "bg-sidebar-accent font-medium border-accent"
                : "border-transparent"
            )}
          >
            <span className="block text-base">{region.name}</span>
            <span className="block text-xs text-sidebar-foreground/60 mt-0.5">
              {region.nameEn}
            </span>
          </button>
        ))}
      </nav>
    </div>
  )
}
