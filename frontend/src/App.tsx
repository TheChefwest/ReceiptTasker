import React from 'react'
import { api } from './api'
import { Task, TaskCreate } from './types'
import CalendarView from './components/CalendarView'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import ImportJson from './components/ImportJson'
import BlackoutPeriods from './components/BlackoutPeriods'
import ThemeToggle from './components/ThemeToggle'

export default function App() {
  const [tasks, setTasks] = React.useState<Task[]>([])

  const load = async () => {
    const { data } = await api.get<Task[]>('/tasks')
    setTasks(data)
  }
  React.useEffect(() => { load() }, [])

  const create = async (t: TaskCreate) => {
    await api.post('/tasks', t)
    await load()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">TaskPrinter</h1>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">Printer: network @ 192.168.2.34</div>
            <ThemeToggle />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <CalendarView tasks={tasks} />
            <TaskList tasks={tasks} refresh={load} />
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl bg-white dark:bg-gray-800 shadow p-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">New task</h3>
              <TaskForm onSubmit={create} />
            </div>
            <BlackoutPeriods refresh={load} />
            <ImportJson onDone={load} />
          </div>
        </div>

        <footer className="text-center text-xs text-gray-500 dark:text-gray-400">© TaskPrinter</footer>
      </div>
    </div>
  )
}