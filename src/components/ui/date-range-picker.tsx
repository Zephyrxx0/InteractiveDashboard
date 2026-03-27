"use client"

import * as React from "react"
import { format, subDays } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  /** The selected date range */
  date?: DateRange
  /** Callback when the date range changes */
  onDateChange?: (range: DateRange | undefined) => void
  /** Placeholder text when no range is selected */
  placeholder?: string
  /** Number of months to display */
  numberOfMonths?: number
  /** Preset options for quick selection */
  presets?: Array<{ label: string; days: number }>
  /** Additional class names */
  className?: string
  /** Disable the component */
  disabled?: boolean
}

const DEFAULT_PRESETS: Array<{ label: string; days: number }> = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
]

/**
 * Date range picker with quick presets and calendar selection.
 * Uses react-day-picker for calendar and date-fns for formatting.
 */
function DateRangePicker({
  date,
  onDateChange,
  placeholder = "Pick a date range",
  numberOfMonths = 2,
  presets = DEFAULT_PRESETS,
  className,
  disabled = false,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handlePresetClick = (days: number) => {
    const to = new Date()
    const from = subDays(to, days)
    onDateChange?.({ from, to })
    setOpen(false)
  }

  const handleSelect = (range: DateRange | undefined) => {
    onDateChange?.(range)
    // Close popover when both dates are selected
    if (range?.from && range?.to) {
      setOpen(false)
    }
  }

  const formatDateRange = () => {
    if (!date?.from) {
      return placeholder
    }
    if (date.to) {
      return `${format(date.from, "MMM d")} - ${format(date.to, "MMM d, yyyy")}`
    }
    return format(date.from, "MMM d, yyyy")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-slot="date-range-picker-trigger"
          className={cn(
            "w-[260px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 size-4" />
          <span className="font-mono text-sm">{formatDateRange()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          {/* Preset buttons */}
          <div className="flex flex-col gap-1 border-r border-border p-3">
            {presets.map((preset) => (
              <Button
                key={preset.days}
                variant="ghost"
                size="sm"
                className="justify-start font-normal"
                onClick={() => handlePresetClick(preset.days)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          {/* Calendar */}
          <div className="p-3">
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleSelect}
              numberOfMonths={numberOfMonths}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { DateRangePicker, type DateRangePickerProps }
