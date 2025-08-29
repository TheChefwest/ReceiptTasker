import React from 'react'
import FullCalendar from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Calendar } from '@fullcalendar/core'
import { Task } from '../types'
import { getCategoryById } from '../utils/categories'

// Lightweight wrapper using FullCalendar via imperative init for Vite simplicity

type Props = {
  tasks: Task[]
}

function parseRrule(rruleStr: string, dtstart: Date, until?: Date | null): Date[] {
  if (!rruleStr) return [dtstart]
  
  const dates: Date[] = []
  const now = new Date()
  const endDate = until || new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000) // 1 year from now if no until
  
  // Parse basic RRULE components
  const parts = rruleStr.split(';')
  const ruleObj: Record<string, string> = {}
  
  parts.forEach(part => {
    const [key, value] = part.split('=')
    if (key && value) {
      ruleObj[key] = value
    }
  })
  
  const freq = ruleObj.FREQ
  const interval = parseInt(ruleObj.INTERVAL || '1')
  
  if (!freq) return [dtstart]
  
  let current = new Date(dtstart)
  const maxOccurrences = 100 // Prevent infinite loops
  let count = 0
  
  while (current <= endDate && count < maxOccurrences) {
    dates.push(new Date(current))
    count++
    
    switch (freq) {
      case 'DAILY':
        current.setDate(current.getDate() + interval)
        break
      case 'WEEKLY':
        current.setDate(current.getDate() + (7 * interval))
        break
      case 'MONTHLY':
        current.setMonth(current.getMonth() + interval)
        break
      case 'YEARLY':
        current.setFullYear(current.getFullYear() + interval)
        break
      default:
        return [dtstart]
    }
  }
  
  return dates
}

function generateTaskEvents(tasks: Task[]) {
  const events: Array<{id: string, title: string, start: string}> = []
  
  // Location color mapping for FullCalendar
  const getCategoryColor = (categoryId: string) => {
    const colorMap: Record<string, string> = {
      'kitchen': '#dc2626',
      'bathroom': '#2563eb',
      'bedroom': '#9333ea',
      'living_room': '#16a34a',
      'office': '#4f46e5',
      'shed': '#ea580c',
      'garden': '#059669',
      'other': '#6b7280'
    }
    return colorMap[categoryId] || colorMap.other
  }

  tasks.forEach(task => {
    const startDate = new Date(task.start_at)
    const untilDate = task.until ? new Date(task.until) : null
    const category = getCategoryById(task.category)
    const color = getCategoryColor(task.category)
    
    if (task.rrule) {
      const occurrences = parseRrule(task.rrule, startDate, untilDate)
      occurrences.forEach((date, index) => {
        events.push({
          id: `${task.id}_${index}`,
          title: `${category.icon} ${task.title}`,
          start: date.toISOString().split('T')[0],
          backgroundColor: color,
          borderColor: color,
          textColor: '#ffffff'
        })
      })
    } else {
      events.push({
        id: String(task.id),
        title: `${category.icon} ${task.title}`,
        start: startDate.toISOString().split('T')[0],
        backgroundColor: color,
        borderColor: color,
        textColor: '#ffffff'
      })
    }
  })
  
  return events
}

export default function CalendarView({ tasks }: Props) {
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (!ref.current) return
    const cal = new Calendar(ref.current, {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      height: 'auto',
      events: generateTaskEvents(tasks),
    })
    cal.render()
    return () => cal.destroy()
  }, [tasks])

  return <div className="rounded-2xl bg-white dark:bg-gray-800 shadow p-4"> <div ref={ref} className="dark:[&_.fc-theme-standard_.fc-scrollgrid]:!border-gray-600 dark:[&_.fc-theme-standard_td]:!border-gray-600 dark:[&_.fc-theme-standard_th]:!border-gray-600 dark:[&_.fc-col-header-cell]:!bg-gray-700 dark:[&_.fc-col-header-cell-cushion]:!text-white dark:[&_.fc-daygrid-day]:!bg-gray-800 dark:[&_.fc-daygrid-day-number]:!text-white dark:[&_.fc-event]:!bg-blue-600" /> </div>
}