import { useCallback, useEffect, useState } from 'react'


const STORAGE_KEY = 'fr.dispatchSettings'

const DEFAULT_SETTINGS = {
  autoOpenNewCases: false,
}


function loadDispatchSettings () {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : { ...DEFAULT_SETTINGS }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}


function saveDispatchSettings (settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // Storage unavailable
  }
}


export default function useDispatchSettings () {
  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS })

  // Load persisted settings after mount (avoids hydration mismatch)
  useEffect(() => {
    setSettings(loadDispatchSettings())
  }, [])

  const update = useCallback((key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value }
      saveDispatchSettings(next)
      return next
    })
  }, [])

  return [settings, update]
}
