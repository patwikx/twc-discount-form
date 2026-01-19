"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 font-mono bg-white", className)}
      classNames={{
        months: "relative flex flex-col",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center h-10",
        caption_label: "text-sm font-black uppercase tracking-wider",
        nav: "flex items-center gap-1 absolute inset-x-1 top-0 justify-between",
        button_previous: cn(
          "inline-flex items-center justify-center size-8 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors"
        ),
        button_next: cn(
          "inline-flex items-center justify-center size-8 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "text-gray-600 w-9 font-bold text-[0.75rem] uppercase text-center",
        weeks: "",
        week: "flex w-full mt-2",
        day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 size-9",
        day_button: cn(
          "size-9 p-0 font-bold border-2 border-transparent hover:border-black transition-all inline-flex items-center justify-center cursor-pointer",
          "aria-selected:bg-black aria-selected:text-white aria-selected:border-black"
        ),
        today: "bg-amber-200 border-amber-500",
        outside: "text-gray-300 opacity-50",
        disabled: "text-gray-300 opacity-50 cursor-not-allowed hover:border-transparent",
        range_middle: "aria-selected:bg-gray-100 aria-selected:text-black",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return <ChevronLeft className="size-4" />
          }
          return <ChevronRight className="size-4" />
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
