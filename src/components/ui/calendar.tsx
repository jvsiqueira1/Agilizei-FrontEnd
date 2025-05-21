'use client'

import * as React from 'react'
import { DayPicker, Modifiers } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import 'react-day-picker/dist/style.css'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  onDayClick,
  ...props
}: CalendarProps) {
  const handleDayClick = (
    date: Date,
    modifiers: Modifiers,
    e: React.MouseEvent<Element, MouseEvent>,
  ) => {
    if (date) {
      const adjustedDate = new Date(date)
      adjustedDate.setHours(12, 0, 0, 0)
      if (onDayClick) {
        onDayClick(adjustedDate, modifiers, e)
      }
    }
  }
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-4 bg-white rounded-md shadow-md', className)}
      classNames={{
        root: 'w-full',
        months: 'flex flex-col sm:flex-row sm:space-x-4 sm:space-y-0 space-y-4',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-7 w-7 p-0 opacity-80 hover:opacity-100',
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse',
        head_row: 'flex justify-between',
        head_cell:
          'text-muted-foreground text-xs font-medium text-center w-9 h-9 flex items-center justify-center',
        row: 'flex w-full mt-1',
        cell: 'w-9 h-9 text-center text-sm p-0 relative flex items-center justify-center',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:bg-orange aria-selected:text-white',
        ),
        day_selected: 'bg-orange text-white hover:bg-orange',
        day_today: 'border border-orange font-semibold',
        day_outside: 'text-muted-foreground opacity-40',
        day_disabled: 'text-muted-foreground opacity-50',
        ...classNames,
      }}
      {...props}
      onDayClick={handleDayClick}
    />
  )
}

Calendar.displayName = 'Calendar'
export { Calendar }
