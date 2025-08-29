import React from 'react'
import { Task, TaskCreate } from '../types'
import { TASK_CATEGORIES, getCategoryById } from '../utils/categories'

type Props = {
  value?: Partial<Task>
  onSubmit: (t: TaskCreate) => void
}

export default function TaskForm({ value, onSubmit }: Props) {
  const [title, setTitle] = React.useState(value?.title || '')
  const [description, setDescription] = React.useState(value?.description || '')
  const [startAt, setStartAt] = React.useState(value?.start_at || new Date().toISOString().slice(0,16))
  const [rrule, setRrule] = React.useState(value?.rrule || '')
  const [autoPrint, setAutoPrint] = React.useState(value?.auto_print ?? true)
  const [isActive, setIsActive] = React.useState(value?.is_active ?? true)
  const [category, setCategory] = React.useState(value?.category || 'other')

  return (
    <form className="space-y-3" onSubmit={e=>{e.preventDefault(); onSubmit({
      title, description, start_at: new Date(startAt).toISOString(), until: null, rrule, auto_print: autoPrint, is_active: isActive, category
    })}}>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
        <input className="mt-1 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2" value={title} onChange={e=>setTitle(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
        <select 
          value={category} 
          onChange={e=>setCategory(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2"
        >
          {TASK_CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
        <textarea className="mt-1 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2" value={description} onChange={e=>setDescription(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start at</label>
        <input type="datetime-local" className="mt-1 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2" value={startAt} onChange={e=>setStartAt(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">RRULE (optional)</label>
        <input placeholder="FREQ=DAILY;INTERVAL=1" className="mt-1 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2" value={rrule} onChange={e=>setRrule(e.target.value)} />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Examples: Daily: FREQ=DAILY;INTERVAL=1 — Weekly: FREQ=WEEKLY;BYDAY=MO,TH — Monthly: FREQ=MONTHLY;BYMONTHDAY=1</p>
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" checked={autoPrint} onChange={e=>setAutoPrint(e.target.checked)} /> Auto print</label>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" checked={isActive} onChange={e=>setIsActive(e.target.checked)} /> Active</label>
      </div>
      <button className="px-4 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black shadow hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">Save task</button>
    </form>
  )
}