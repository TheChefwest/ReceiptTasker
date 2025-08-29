import React from 'react'
import { Task } from '../types'
import { api } from '../api'
import { getCategoryById } from '../utils/categories'

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
        {tasks.length === 0 ? (
          <li className="p-8 text-center text-gray-500 dark:text-gray-400">
            No tasks found matching your criteria
          </li>
        ) : (
          tasks.map(t=> {
            const category = getCategoryById(t.category)
            return (
              <li key={t.id} className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${category.color} ${category.bgColor}`}
                    >
                      {category.icon} {category.name}
                    </span>
                    <div className="font-medium text-gray-900 dark:text-white">{t.title}</div>
                  </div>
                  {t.description && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t.description}</div>
                  )}
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Start {new Date(t.start_at).toLocaleString()} 
                    {t.rrule && ` • RRULE ${t.rrule}`}
                    {!t.is_active && ' • Inactive'}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button 
                    onClick={()=>printNow(t.id)} 
                    className="px-3 py-1 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm"
                  >
                    Print
                  </button>
                  <button 
                    onClick={()=>del(t.id)} 
                    className="px-3 py-1 rounded-lg bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-800 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            )
          })
        )}
      </ul>
    </div>
  )
}