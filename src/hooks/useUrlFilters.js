import { useCallback, useEffect, useRef, useState } from 'react'


export default function useUrlFilters (filters, setFilter, initialFilters, basePath) {
  const initializedRef = useRef(false)
  const [hasUrlFilters, setHasUrlFilters] = useState(false)

  // Restore filters from URL on mount
  useEffect(() => {
    if (initializedRef.current) {
      return
    }
    initializedRef.current = true

    const urlParams = new URLSearchParams(window.location.search)
    let foundFilters = false
    urlParams.forEach((value, key) => {
      if (Object.hasOwn(initialFilters, key)) {
        setFilter({ field: key, value })
        if (key !== 'sort' && value !== initialFilters[key]) {
          foundFilters = true
        }
      }
    })
    setHasUrlFilters(foundFilters)
  }, [initialFilters, setFilter])

  // Update URL when filters change (after initialization)
  const updateUrl = useCallback((currentFilters, currentPage) => {
    if (!initializedRef.current) {
      return
    }

    const params = new URLSearchParams()
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value && value !== initialFilters[key]) {
        params.set(key, value)
      }
    })
    if (currentPage && currentPage > 1) {
      params.set('rpage', String(currentPage))
    }

    const queryString = params.toString()
    const newPath = queryString ? `${basePath}?${queryString}` : basePath

    window.history.replaceState(null, '', newPath)
  }, [initialFilters, basePath])

  return { updateUrl, hasUrlFilters }
}
