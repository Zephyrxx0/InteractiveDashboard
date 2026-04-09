"use client"

import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import {
  Folder,
  FileText,
  Calendar,
  CheckSquare,
  Users,
  Settings,
  Home,
  Star,
  Heart,
  Flag,
  Tag,
  Bookmark,
  Clock,
  Bell,
  Mail,
  MessageSquare,
  Image,
  Video,
  Music,
  Code,
  Database,
  Server,
  Globe,
  Zap,
  Building,
  Briefcase,
  Target,
  TrendingUp,
  Shield,
  Leaf,
  Sun,
  Moon,
  type LucideIcon,
} from "lucide-react"

// Icon map for dynamic rendering
const ICON_MAP: Record<string, LucideIcon> = {
  Folder,
  FileText,
  Calendar,
  CheckSquare,
  Users,
  Settings,
  Home,
  Star,
  Heart,
  Flag,
  Tag,
  Bookmark,
  Clock,
  Bell,
  Mail,
  MessageSquare,
  Image,
  Video,
  Music,
  Code,
  Database,
  Server,
  Globe,
  Zap,
  Building,
  Briefcase,
  Target,
  TrendingUp,
  Shield,
  Leaf,
  Sun,
  Moon,
}

const ICON_OPTIONS = Object.keys(ICON_MAP)

interface IconPickerProps {
  value?: string
  onChange: (icon: string) => void
  className?: string
  disabled?: boolean
}

export function IconPicker({ value = "Folder", onChange, className, disabled }: IconPickerProps) {
  const [open, setOpen] = React.useState(false)
  const SelectedIcon = ICON_MAP[value] || Folder

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={cn("w-full justify-start gap-2", className)}
          disabled={disabled}
        >
          <SelectedIcon className="h-4 w-4" />
          <span className="font-mono text-sm">{value}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="start">
        <div className="mb-2">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Select Icon
          </p>
        </div>
        <div className="grid grid-cols-8 gap-1">
          {ICON_OPTIONS.map((iconName) => {
            const Icon = ICON_MAP[iconName]
            const isSelected = value === iconName
            return (
              <Button
                key={iconName}
                variant={isSelected ? "default" : "ghost"}
                size="icon"
                className={cn(
                  "h-8 w-8",
                  isSelected && "ring-2 ring-primary ring-offset-1"
                )}
                onClick={() => {
                  onChange(iconName)
                  setOpen(false)
                }}
                title={iconName}
              >
                <Icon className="h-4 w-4" />
              </Button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { ICON_MAP, ICON_OPTIONS }
