"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { 
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { UseFormReturn } from "react-hook-form"
import { FormValues } from "./types"

interface DateRangePickerProps {
  form: UseFormReturn<FormValues>
}

export function DateRangePicker({ form }: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })

  return (
    <FormItem>
      <FormLabel>Mint Period (Optional)</FormLabel>
      <FormControl>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={(selectedDate) => {
                setDate(selectedDate)
                form.setValue("mintPeriod", selectedDate)
                if (selectedDate?.from) {
                  form.setValue("mintStartTime", selectedDate.from.toISOString())
                }
                if (selectedDate?.to) {
                  form.setValue("mintEndTime", selectedDate.to.toISOString())
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </FormControl>
      <FormDescription>
        Set the start and end time for minting period
      </FormDescription>
      <FormMessage />
    </FormItem>
  )
}