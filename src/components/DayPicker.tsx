import * as React from 'react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'

interface DatePickerInputProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function DatePickerInput({
  value,
  onChange,
  className,
}: DatePickerInputProps) {
  const selectedDate = React.useMemo(() => {
    if (!value) return undefined
    const [day, month, year] = value.split('/')
    return new Date(Number(year), Number(month) - 1, Number(day))
  }, [value])

  const handleSelect = (date: Date | undefined) => {
    if (!date) return
    const adjustedDate = new Date(date)
    adjustedDate.setHours(12, 0, 0, 0)
    onChange(format(adjustedDate, 'dd/MM/yyyy', { locale: ptBR }))
  }

  const today = React.useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return now
  }, [])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start bg-white text-left ${
            value ? 'text-foreground' : 'text-muted-foreground'
          } ${className ?? ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ?? 'Selecione uma data'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-auto p-0 ${className ?? ''}`} align="start">
        <Calendar
          mode="single"
          locale={ptBR}
          selected={selectedDate}
          onSelect={handleSelect}
          autoFocus
          disabled={{ before: today }}
          modifiers={{ past: { before: today } }}
          modifiersClassNames={{
            past: 'text-red-400 pointer-events-none',
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
