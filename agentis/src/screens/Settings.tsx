import { useEffect, useRef, useState } from 'react'
import * as api from '../lib/api'
import ErrorBoundary from '../components/ErrorBoundary'

// Dynamically import Tauri store — falls back gracefully in browser dev mode
async function getTauriStore() {
  try {
    const pluginStore = await import('@tauri-apps/plugin-store')
    // v2 API: load() is the factory function (constructor is private)
    return await pluginStore.load('settings.json')
  } catch {
    return null
  }
}

type SaveResult = 'idle' | 'success' | 'error'

export default function Settings() {
  const [apiKey, setApiKey] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveResult, setSaveResult] = useState<SaveResult>('idle')
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    void (async () => {
      const store = await getTauriStore()
      if (store) {
        const saved = await store.get<string>('anthropic_api_key')
        if (saved) {
          setApiKey(saved)
          // Sync to backend in-memory store
          try {
            await api.setApiKey(saved)
          } catch (err) {
            console.warn('Could not sync API key to backend on load:', err)
          }
        }
      }
    })()

    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    }
  }, [])

  async function handleSave() {
    setIsSaving(true)
    setSaveResult('idle')
    try {
      const store = await getTauriStore()
      if (store) {
        await store.set('anthropic_api_key', apiKey)
        await store.save()
      }
      await api.setApiKey(apiKey)
      setSaveResult('success')
      resetTimerRef.current = setTimeout(() => setSaveResult('idle'), 3000)
    } catch (err) {
      console.error('Failed to save API key:', err)
      setSaveResult('error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ErrorBoundary>
      <div className="p-6 max-w-xl">
        <h1 className="text-zinc-100 text-2xl font-bold mb-6">Settings</h1>

        <div className="border-t border-zinc-800 pt-6">
          <label className="block text-zinc-200 text-sm font-medium mb-2">
            Anthropic API Key
          </label>

          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-ant-…"
            className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors mb-3"
          />

          <div className="flex items-center gap-3">
            <button
              onClick={() => void handleSave()}
              disabled={isSaving}
              className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              {isSaving ? 'Saving…' : 'Save'}
            </button>

            {saveResult === 'success' && (
              <span className="text-green-400 text-sm">API key saved</span>
            )}
            {saveResult === 'error' && (
              <span className="text-red-400 text-sm">
                Failed to save. Please try again.
              </span>
            )}
          </div>

          <p className="mt-4 text-zinc-500 text-xs leading-relaxed">
            Your key is stored locally on this device and never sent anywhere
            except directly to Anthropic's API.
          </p>
        </div>
      </div>
    </ErrorBoundary>
  )
}
