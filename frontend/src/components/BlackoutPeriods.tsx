import React, { useState, useEffect } from 'react'
import { api } from '../api'
import { BlackoutPeriod, BlackoutPeriodCreate } from '../types'

interface Props {
  refresh?: () => void
}

export default function BlackoutPeriods({ refresh }: Props) {
  const [periods, setPeriods] = useState<BlackoutPeriod[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<BlackoutPeriodCreate>({
    name: '',
    start_date: '',
    end_date: '',
    is_active: true
  })

  const loadPeriods = async () => {
    try {
      const { data } = await api.get<BlackoutPeriod[]>('/blackout-periods')
      setPeriods(data)
    } catch (error) {
      console.error('Failed to load blackout periods:', error)
    }
  }

  useEffect(() => {
    loadPeriods()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/blackout-periods', formData)
      setFormData({ name: '', start_date: '', end_date: '', is_active: true })
      setShowForm(false)
      await loadPeriods()
      refresh?.()
    } catch (error) {
      console.error('Failed to create blackout period:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Delete this blackout period?')) {
      try {
        await api.delete(`/blackout-periods/${id}`)
        await loadPeriods()
        refresh?.()
      } catch (error) {
        console.error('Failed to delete blackout period:', error)
      }
    }
  }

  const toggleActive = async (id: number, is_active: boolean) => {
    try {
      await api.patch(`/blackout-periods/${id}`, { is_active: !is_active })
      await loadPeriods()
      refresh?.()
    } catch (error) {
      console.error('Failed to toggle blackout period:', error)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Blackout Periods</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black shadow text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Period'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
          <input
            type="text"
            placeholder="Period name (e.g., Christmas Holiday)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded text-sm"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Start Date</label>
              <input
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">End Date</label>
              <input
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded text-sm"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black shadow hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Create Blackout Period
          </button>
        </form>
      )}

      <div className="space-y-2">
        {periods.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">No blackout periods defined</p>
        ) : (
          periods.map((period) => (
            <div
              key={period.id}
              className={`p-3 border rounded-lg ${
                period.is_active 
                  ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900 dark:text-white">
                    {period.name || 'Unnamed Period'}
                    {!period.is_active && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {formatDate(period.start_date)} - {formatDate(period.end_date)}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => toggleActive(period.id, period.is_active)}
                    className={`px-2 py-1 text-xs rounded ${
                      period.is_active
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                    }`}
                  >
                    {period.is_active ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => handleDelete(period.id)}
                    className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        Tasks will not print during active blackout periods, but will continue to be scheduled normally.
      </div>
    </div>
  )
}