"use client"

import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface AddCardProps {
  label?: string
  description?: string
  onClick: () => void
  className?: string
  minHeight?: string
}

/**
 * AddCard provides a clickable card placeholder for adding new items.
 * Uses a dashed border and plus icon to indicate an "add" action.
 * 
 * @example
 * ```tsx
 * <AddCard 
 *   label="Add Output" 
 *   onClick={() => setShowModal(true)} 
 * />
 * ```
 */
export function AddCard({ 
  label = "Add new", 
  description,
  onClick, 
  className,
  minHeight = "120px",
}: AddCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center",
        "w-full rounded-lg",
        "border-2 border-dashed border-muted-foreground/30",
        "text-muted-foreground",
        "bg-transparent",
        "hover:border-primary/50 hover:text-primary hover:bg-primary/5",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "cursor-pointer",
        className
      )}
      style={{ minHeight }}
    >
      <Plus className="h-8 w-8 mb-2" />
      <span className="text-sm font-medium">{label}</span>
      {description && (
        <span className="text-xs text-muted-foreground/70 mt-1">{description}</span>
      )}
    </button>
  )
}
