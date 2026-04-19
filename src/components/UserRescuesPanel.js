import { useRouter } from 'next/router'
import {
  useCallback, useEffect, useMemo, useReducer, useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useDebouncedCallback from '~/hooks/useDebouncedCallback'
import { getMyRescues } from '~/store/actions/rescues'
import {
  selectPageViewDataById, selectPageViewMetaById,
  withCurrentUserId, selectRatsByUserId,
} from '~/store/selectors'

import {
  RESCUE_SORT_OPTIONS,
  initialRescueFilters,
  rescueFilterReducer,
  buildRescueFilterParams,
  getRescueFilterFields,
} from './RescueSearch/rescueFilterConfig'
import RescueTable from './RescueTable'
import SearchFilterPanel from './SearchFilterPanel'



const PAGE_VIEW_ID = 'user-rescues'
const PAGE_SIZE = 25
const SEARCH_DEBOUNCE_MS = 500

const SEARCH_FIELD = { field: 'client', placeholder: 'Search by CMDR name...', label: 'Search by CMDR' }


function useQueryPage () {
  const router = useRouter()
  const [page, setPage] = useState(1)

  useEffect(() => {
    const handleRouteChange = (url) => {
      const match = url.match(/[?&]rpage=(\d+)/u)
      setPage(match ? Math.max(Number(match[1]), 1) : 1)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return page
}

function UserRescuesPanel () {
  const dispatch = useDispatch()
  const page = useQueryPage()
  const offset = (page - 1) * PAGE_SIZE
  const [fetchError, setFetchError] = useState(false)
  const userRats = useSelector(withCurrentUserId(selectRatsByUserId))
  const [filters, setFilter] = useReducer(rescueFilterReducer, initialRescueFilters)
  const [debouncedFilters, setDebouncedFilters] = useState(initialRescueFilters)
  const [showFilters, setShowFilters] = useState(false)

  const applyFilters = useDebouncedCallback((nextFilters) => {
    setDebouncedFilters(nextFilters)
  }, [], SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    applyFilters(filters)
  }, [filters, applyFilters])

  const rescues = useSelector((state) => {
    return selectPageViewDataById(state, { pageViewId: PAGE_VIEW_ID })
  })
  const meta = useSelector((state) => {
    return selectPageViewMetaById(state, { pageViewId: PAGE_VIEW_ID })
  })

  useEffect(() => {
    setFetchError(false)
    const params = buildRescueFilterParams(debouncedFilters, offset, PAGE_SIZE)
    if (debouncedFilters.firstLimpet) {
      params._firstLimpet = 'me'
    }
    if (debouncedFilters.rat) {
      params._rat = debouncedFilters.rat
    }
    Promise.resolve(dispatch(getMyRescues(
      params,
      {
        pageView: {
          id: PAGE_VIEW_ID,
          type: 'rescues',
        },
      },
    ))).then((result) => {
      if (result?.error) {
        setFetchError(true)
      }
    })
  }, [dispatch, offset, debouncedFilters])

  const handleFilterChange = useCallback((field, value) => {
    setFilter({ field, value })
  }, [])

  const handleResetFilters = useCallback(() => {
    setFilter({ type: 'reset' })
  }, [])

  const handleToggleFilters = useCallback(() => {
    setShowFilters((prev) => {
      return !prev
    })
  }, [])

  const { fields, footerFields } = useMemo(() => {
    return getRescueFilterFields({ userRats, showFirstLimpet: true })
  }, [userRats])

  const total = meta?.total ?? meta?.count ?? 0
  let totalPages = page
  if (total) {
    totalPages = Math.ceil(total / PAGE_SIZE)
  } else if (rescues?.length === PAGE_SIZE) {
    totalPages = page + 1
  }

  const handleGenerateRoute = useCallback(({ page: nextPage }) => {
    return nextPage > 1 ? `/profile/rescues?rpage=${nextPage}` : '/profile/rescues'
  }, [])

  return (
    <>
      <SearchFilterPanel
        fields={fields}
        filters={filters}
        footerFields={footerFields}
        searchField={SEARCH_FIELD}
        showFilters={showFilters}
        sortOptions={RESCUE_SORT_OPTIONS}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onToggleFilters={handleToggleFilters} />
      <RescueTable
        fetchError={fetchError}
        page={page}
        paperworkFrom="profile"
        rescues={rescues}
        total={total}
        totalPages={totalPages}
        onGenerateRoute={handleGenerateRoute} />
    </>
  )
}


export default UserRescuesPanel
