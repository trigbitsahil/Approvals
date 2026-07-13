"use client"

import * as React from "react"

import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {i18n} from '@lingui/core'
export const Calendar1=() => {
  const [dropdown, setDropdown] =
    React.useState<React.ComponentProps<typeof Calendar>["captionLayout"]>(
      "dropdown"
    )
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12)
  )

  return (
    <div className="flex flex-col items-center  gap-6 min-h-screen">
      <Calendar
        mode="single"
        defaultMonth={date}
        selected={date}
        onSelect={setDate}
        captionLayout={dropdown}
        className="rounded-lg border shadow-sm"
      />

      <div className="w-[220px]">
        <Label htmlFor="dropdown" className="px-1 text-sm">
                    {i18n.t({id:"ui.Dropdown",message:"Dropdown"})}
          
        </Label>
        <Select
          value={dropdown}
          onValueChange={(value) =>
            setDropdown(
              value as React.ComponentProps<typeof Calendar>["captionLayout"]
            )
          }
        >
          <SelectTrigger
            id="dropdown"
            size="sm"
            className="bg-background w-full"
          >
            <SelectValue placeholder="Dropdown" />
          </SelectTrigger>
          <SelectContent className="w-full">
            <SelectItem value="dropdown">          {i18n.t({id:"ui.Month and Year",message:"Month and Year"})}
</SelectItem>
            <SelectItem value="dropdown-months">{i18n.t({id:"ui.Month Only",message:"Month Only"})}</SelectItem>
            <SelectItem value="dropdown-years">{i18n.t({id:"ui.Year Only",message:"Year Only"})}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default Calendar1
