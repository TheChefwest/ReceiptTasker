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
    <div className="rounded-2xl bg-white dark:bg-gray-800 shadow">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tasks</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">{tasks.length} total</span>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {tasks.map(t=> (
          <li key={t.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">{t.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Start {new Date(t.start_at).toLocaleString()} {t.rrule && `• RRULE ${t.rrule}`}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>printNow(t.id)} className="px-3 py-1 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">Print</button>
              <button onClick={()=>del(t.id)} className="px-3 py-1 rounded-lg bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-800 transition-colors">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}