import React from 'react'
import FullCalendar from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Calendar } from '@fullcalendar/core'
import { Task } from '../types'

// Lightweight wrapper using FullCalendar via imperative init for Vite simplicity

type Props = {
  tasks: Task[]
}

export default function CalendarView({ tasks }: Props) {
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (!ref.current) return
    const cal = new Calendar(ref.current, {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      height: 'auto',
      events: tasks.map(t => ({
        id: String(t.id),
        title: t.title,
        start: t.start_at,
      })),
    })
    cal.render()
    return () => cal.destroy()
  }, [tasks])

  return <div className="rounded-2xl bg-white shadow p-4"> <div ref={ref} /> </div>
}