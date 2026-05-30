import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toDateString } from '../constants/partnerStages'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function buildMonthDays(year, month) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days = []

  for (let i = 0; i < firstDay.getDay(); i++) days.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d))
  }
  return days
}

export default function DateCalendar({ selectedDate, onSelectDate, markedDates = [] }) {
  const today = new Date()
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [viewYear, setViewYear] = useState(today.getFullYear())

  const days = useMemo(() => buildMonthDays(viewYear, viewMonth), [viewYear, viewMonth])
  const markedSet = useMemo(() => new Set(markedDates.map(toDateString)), [markedDates])

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const goToday = () => {
    setViewMonth(today.getMonth())
    setViewYear(today.getFullYear())
    onSelectDate(toDateString(today))
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            {MONTHS[viewMonth]} {viewYear}
          </p>
          <button
            type="button"
            onClick={goToday}
            className="mt-0.5 text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            Today
          </button>
        </div>
        <button
          type="button"
          onClick={nextMonth}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-1 text-xs font-medium text-slate-400">
            {day}
          </div>
        ))}
        {days.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />

          const dateStr = toDateString(date)
          const isSelected = selectedDate === dateStr
          const isToday = toDateString(today) === dateStr
          const hasEvents = markedSet.has(dateStr)

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => onSelectDate(isSelected ? '' : dateStr)}
              className={`relative flex h-9 w-full items-center justify-center rounded-lg text-sm transition ${
                isSelected
                  ? 'bg-brand-600 font-semibold text-white'
                  : isToday
                    ? 'bg-brand-50 font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {date.getDate()}
              {hasEvents && !isSelected && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-brand-500" />
              )}
            </button>
          )
        })}
      </div>

      {selectedDate && (
        <button
          type="button"
          onClick={() => onSelectDate('')}
          className="mt-3 w-full rounded-lg border border-slate-200 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          Clear date filter
        </button>
      )}
    </div>
  )
}
