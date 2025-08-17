import React from 'react'
import { Task } from '../types'
import { api } from '../api'

type Props = {
  tasks: Task[]
  refresh: () => void
}

export default function TaskList({ tasks, refresh }: Props) {
  const del = async (id: number) => { await api.delete(`/tasks/${id}`); refresh() }
  const printNow = async (id: number) => { await api.post(`/tasks/${id}/print`); }

  return (
    <div className="rounded-2xl bg-white shadow">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tasks</h3>
        <span className="text-sm text-gray-500">{tasks.length} total</span>
      </div>
      <ul className="divide-y">
        {tasks.map(t=> (
          <li key={t.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{t.title}</div>
              <div className="text-xs text-gray-500">Start {new Date(t.start_at).toLocaleString()} {t.rrule && `• RRULE ${t.rrule}`}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>printNow(t.id)} className="px-3 py-1 rounded-lg bg-gray-900 text-white">Print</button>
              <button onClick={()=>del(t.id)} className="px-3 py-1 rounded-lg bg-red-600 text-white">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}