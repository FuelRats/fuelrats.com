import { useRouter } from 'next/router'
import {
  useCallback, useEffect, useMemo, useReducer, useRef, useState,
} from 'react'


export default function useUrlFilters (initialFilters, filterReducer, basePath) {
  const router = useRouter()
  const lastSyncedRef = useRef(JSON.stringify(initialFilters))
  const [filters, setFilter] = useReducer(filterReducer, initialFilters)
  const [hasUrlFilters, setHasUrlFilters] = useState(false)

  // Restore filters from URL after mount (avoids hydration mismatch)
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const urlParams = new URLSearchParams(window.location.search)
    let found = false
    const nextFilters = { ...initialFilters }
    urlParams.forEach((value, key) => {
      if (Object.hasOwn(initialFilters, key) && value !== initialFilters[key]) {
        setFilter({ field: key, value })
        nextFilters[key] = value
        if (key !== 'sort') {
          found = true
        }
      }
    })
    if (found) {
      setHasUrlFilters(true)
    }
    lastSyncedRef.current = JSON.stringify(nextFilters)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- mount only

  const page = Number(router.query.rpage) || 1

  const computedHasUrlFilters = useMemo(() => {
    return hasUrlFilters || Object.entries(filters).some(([key, value]) => {
      return key !== 'sort' && value && value !== initialFilters[key]
    })
  }, [filters, initialFilters, hasUrlFilters])

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

  // Only updates URL when filters actually change
  const syncUrl = useCallback((currentFilters) => {
    const serialized = JSON.stringify(currentFilters)
    if (serialized === lastSyncedRef.current) {
      return
    }
    lastSyncedRef.current = serialized
    const newPath = buildUrl(currentFilters, 1)
    window.history.replaceState(null, '', newPath)
  }, [buildUrl])

  const handleGenerateRoute = useCallback(({ page: nextPage }) => {
    return buildUrl(filters, nextPage)
  }, [buildUrl, filters])

  return {
    filters,
    setFilter,
    page,
    hasUrlFilters: computedHasUrlFilters,
    syncUrl,
    handleGenerateRoute,
  }
}
