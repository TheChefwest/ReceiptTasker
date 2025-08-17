import React from 'react'
import { api } from '../api'

export default function ImportJson({ onDone }: { onDone: ()=>void }) {
  const [text, setText] = React.useState('{\n  "tasks": [\n    {\n      "title": "Feed the fish",\n      "description": "Pinch of flakes",\n      "start_at": "2025-08-17T08:00:00Z",\n      "rrule": "FREQ=DAILY;INTERVAL=1",\n      "auto_print": true,\n      "is_active": true\n    }\n  ]\n}')

  const submit = async () => {
    await api.post('/import', JSON.parse(text))
    onDone()
  }

  return (
    <div className="rounded-2xl bg-white shadow p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Import from JSON</h3>
        <button onClick={submit} className="px-3 py-1 rounded-lg bg-black text-white">Import</button>
      </div>
      <textarea value={text} onChange={e=>setText(e.target.value)} className="w-full h-48 rounded-xl border p-2 font-mono text-sm" />
    </div>
  )
}