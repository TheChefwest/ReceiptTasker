import React from 'react'
import { api } from '../api'

export default function ExportJson() {
  const [exportData, setExportData] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const handleExport = async () => {
    setIsLoading(true)
    try {
      const { data } = await api.get('/export')
      const formatted = JSON.stringify(data, null, 2)
      setExportData(formatted)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (!exportData) return
    
    const blob = new Blob([exportData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tasks-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopy = async () => {
    if (!exportData) return
    
    try {
      await navigator.clipboard.writeText(exportData)
      alert('JSON copied to clipboard!')
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 shadow p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export to JSON</h3>
        <div className="flex gap-2">
          <button 
            onClick={handleExport} 
            disabled={isLoading}
            className="px-3 py-1 rounded-lg bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Export'}
          </button>
          {exportData && (
            <>
              <button 
                onClick={handleCopy}
                className="px-3 py-1 rounded-lg bg-green-600 dark:bg-green-500 text-white hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
              >
                Copy
              </button>
              <button 
                onClick={handleDownload}
                className="px-3 py-1 rounded-lg bg-purple-600 dark:bg-purple-500 text-white hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
              >
                Download
              </button>
            </>
          )}
        </div>
      </div>
      {exportData && (
        <textarea 
          value={exportData} 
          readOnly 
          className="w-full h-48 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-2 font-mono text-sm" 
          placeholder="Exported JSON will appear here..."
        />
      )}
    </div>
  )
}