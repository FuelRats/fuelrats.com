import { useRouter } from 'next/router'
import {
  useCallback, useMemo, useReducer, useRef, useState,
} from 'react'


export default function useUrlFilters (initialFilters, filterReducer, basePath) {
  const router = useRouter()

  // Initialize filters from URL query on first render
  const [initializedFilters] = useState(() => {
    const restored = { ...initialFilters }
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      urlParams.forEach((value, key) => {
        if (Object.hasOwn(initialFilters, key)) {
          restored[key] = value
        }
      })
    }
    return restored
  })

  const lastSyncedRef = useRef(JSON.stringify(initializedFilters))
  const [filters, setFilter] = useReducer(filterReducer, initializedFilters)

  const page = Number(router.query.rpage) || 1

  const hasUrlFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      return key !== 'sort' && value && value !== initialFilters[key]
    })
  }, [filters, initialFilters])

  const buildUrl = useCallback((currentFilters, nextPage) => {
    const params = new URLSearchParams()
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value && value !== initialFilters[key]) {
        params.set(key, value)
      }
    })
    if (nextPage > 1) {
      params.set('rpage', String(nextPage))
    }
    const queryString = params.toString()
    return queryString ? `${basePath}?${queryString}` : basePath
  }, [initialFilters, basePath])

  // Only updates URL when filters actually change — skips if same as last sync
  const syncUrl = useCallback((currentFilters) => {
    const serialized = JSON.stringify(currentFilters)
    if (serialized === lastSyncedRef.current) {
      return
    }
    lastSyncedRef.current = serialized
    const newPath = buildUrl(currentFilters, 1)
    router.replace(newPath, undefined, { shallow: true })
  }, [buildUrl, router])

  const handleGenerateRoute = useCallback(({ page: nextPage }) => {
    return buildUrl(filters, nextPage)
  }, [buildUrl, filters])

  return {
    filters,
    setFilter,
    page,
    hasUrlFilters,
    syncUrl,
    handleGenerateRoute,
  }
}
