import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  useCallback, useEffect, useMemo, useReducer, useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { authenticated } from '~/components/AppLayout'
import ConfirmActionButton from '~/components/ConfirmActionButton'
import CopyToClipboard from '~/components/CopyToClipboard'
import Pagination from '~/components/Pagination'
import PlatformBadge from '~/components/PlatformBadge'
import RatName from '~/components/RatName'
import RatTagsInput from '~/components/RatTagsInput'
import {
  RESCUE_SORT_OPTIONS,
  initialRescueFilters,
  rescueFilterReducer,
  buildRescueFilterParams,
  getRescueFilterFields,
} from '~/components/RescueSearch/rescueFilterConfig'
import SearchFilterPanel from '~/components/SearchFilterPanel'
import useDebouncedCallback from '~/hooks/useDebouncedCallback'
import { deleteRescue, getRescues } from '~/store/actions/rescues'
import {
  selectPageViewDataById, selectPageViewMetaById,
  selectRatsByRescueId, selectRatById,
} from '~/store/selectors'
import formatAsEliteDateTime from '~/util/date/formatAsEliteDateTime'
import getRatTag from '~/util/getRatTag'
import getResponseError from '~/util/getResponseError'
import makePaperworkRoute from '~/util/router/makePaperworkRoute'

import styles from './AdminRescues.module.scss'



const PAGE_VIEW_ID = 'admin-rescues'
const PAGE_SIZE = 25
const SEARCH_DEBOUNCE_MS = 500
const SHORT_ID_LENGTH = 8

const SEARCH_FIELD = { field: 'client', placeholder: 'Search by CMDR name...', label: 'Search by CMDR' }

const outcomeLabels = {
  success: { label: 'Success', icon: 'circle-check', className: styles.success },
  failure: { label: 'Failure', icon: 'circle-xmark', className: styles.failure },
  invalid: { label: 'Invalid', icon: 'triangle-exclamation', className: styles.invalid },
  other: { label: 'Other', icon: 'circle-exclamation', className: styles.other },
  purge: { label: 'Trash', icon: 'trash', className: styles.other },
}

const statusLabels = {
  open: { label: 'Open', className: styles.statusOpen },
  inactive: { label: 'Inactive', className: styles.statusInactive },
  queued: { label: 'Queued', className: styles.statusQueued },
  closed: { label: 'Closed', className: styles.statusClosed },
}


function RescueRatCell ({ rescueId }) {
  const rats = useSelector((state) => {
    return selectRatsByRescueId(state, { rescueId })
  })
  return (
    <td className={styles.rats}>
      {(!rats || rats.length === 0) && '-'}
      {
        rats?.map((rat) => {
          return (
            <div key={rat.id} className={styles.ratEntry}>
              <RatName rat={rat} size={18} />
            </div>
          )
        })
      }
    </td>
  )
}


function FirstLimpetCell ({ rescue }) {
  const firstLimpetId = rescue.relationships?.firstLimpet?.data?.id
  const rat = useSelector((state) => {
    return firstLimpetId ? selectRatById(state, { ratId: firstLimpetId }) : null
  })
  return (
    <td className={styles.firstLimpet}>
      {rat ? <RatName rat={rat} size={18} /> : '-'}
    </td>
  )
}


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


function AdminRescues () {
  const dispatch = useDispatch()
  const page = useQueryPage()
  const offset = (page - 1) * PAGE_SIZE
  const [fetchError, setFetchError] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const [filters, setFilter] = useReducer(rescueFilterReducer, initialRescueFilters)
  const [debouncedFilters, setDebouncedFilters] = useState(initialRescueFilters)
  const [showFilters, setShowFilters] = useState(false)

  const [filterRat, setFilterRat] = useState(null)
  const [filterFirstLimpet, setFilterFirstLimpet] = useState(null)

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
    params.include = 'rats,firstLimpet'
    if (filterRat) {
      params._rats = filterRat.id
    }
    if (filterFirstLimpet) {
      const currentFilter = JSON.parse(params.filter)
      currentFilter.firstLimpetId = filterFirstLimpet.id
      params.filter = JSON.stringify(currentFilter)
    }
    Promise.resolve(dispatch(getRescues(
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
  }, [dispatch, offset, debouncedFilters, filterRat, filterFirstLimpet])

  const handleFilterChange = useCallback((field, value) => {
    setFilter({ field, value })
  }, [])

  const handleResetFilters = useCallback(() => {
    setFilter({ type: 'reset' })
    setFilterRat(null)
    setFilterFirstLimpet(null)
  }, [])

  const handleToggleFilters = useCallback(() => {
    setShowFilters((prev) => {
      return !prev
    })
  }, [])

  const handleDelete = useCallback(async (rescue) => {
    setDeleteError(null)
    const response = await dispatch(deleteRescue(rescue))
    const err = getResponseError(response)
    if (err) {
      setDeleteError(err.detail ?? 'Failed to delete rescue.')
    }
    return true
  }, [dispatch])

  const handleRatFilterChange = useCallback((rats) => {
    setFilterRat(rats?.[0] ?? null)
  }, [])

  const handleFirstLimpetFilterChange = useCallback((rats) => {
    setFilterFirstLimpet(rats?.[0] ?? null)
  }, [])

  const { fields: baseFields, footerFields } = useMemo(() => {
    return getRescueFilterFields({ admin: true })
  }, [])

  const fields = useMemo(() => {
    return [
      ...baseFields,
      {
        type: 'custom',
        render: () => {
          return (
            <div key="rat-filters" className={styles.ratFilterRow}>
              <label className={styles.ratFilterField}>
                <span>{'Assigned Rat'}</span>
                <RatTagsInput
                  data-single
                  aria-label="Filter by assigned rat"
                  placeholder="Search rat name..."
                  value={filterRat ? [filterRat] : []}
                  valueProp={getRatTag}
                  onChange={handleRatFilterChange} />
              </label>
              <label className={styles.ratFilterField}>
                <span>{'First Limpet'}</span>
                <RatTagsInput
                  data-single
                  aria-label="Filter by first limpet"
                  placeholder="Search rat name..."
                  value={filterFirstLimpet ? [filterFirstLimpet] : []}
                  valueProp={getRatTag}
                  onChange={handleFirstLimpetFilterChange} />
              </label>
            </div>
          )
        },
      },
    ]
  }, [baseFields, filterRat, filterFirstLimpet, handleRatFilterChange, handleFirstLimpetFilterChange])

  const total = meta?.total ?? meta?.count ?? 0
  let totalPages = page
  if (total) {
    totalPages = Math.ceil(total / PAGE_SIZE)
  } else if (rescues?.length === PAGE_SIZE) {
    totalPages = page + 1
  }

  const handleGenerateRoute = useCallback(({ page: nextPage }) => {
    return nextPage > 1 ? `/admin/rescues?rpage=${nextPage}` : '/admin/rescues'
  }, [])

  return (
    <div className="page-content">
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

      {
        deleteError && (
          <div className={styles.errorBanner}>{deleteError}</div>
        )
      }

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{'CMDR'}</th>
              <th>{'System'}</th>
              <th>{'Platform'}</th>
              <th>{'Rats'}</th>
              <th>{'1st Limpet'}</th>
              <th>{'Status'}</th>
              <th>{'Outcome'}</th>
              <th>{'Date'}</th>
              <th>{'ID'}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {
              (!rescues || rescues.length === 0) && (
                <tr>
                  <td className={styles.empty} colSpan={10}>
                    {fetchError && 'Failed to load rescues.'}
                    {!fetchError && rescues && 'No rescues found.'}
                    {!fetchError && !rescues && 'Loading...'}
                  </td>
                </tr>
              )
            }
            {
              rescues?.filter(Boolean).map((rescue) => {
                const {
                  client, system, platform, expansion, outcome, codeRed, status, createdAt,
                } = rescue.attributes
                const outcomeInfo = outcomeLabels[outcome]
                const statusInfo = statusLabels[status]
                const shortId = rescue.id.slice(0, SHORT_ID_LENGTH)

                return (
                  <tr
                    key={rescue.id}
                    className={clsx({ [styles.codeRed]: codeRed })}>
                    <td className={styles.cmdr}>
                      <small>{'CMDR '}</small>
                      {client}
                    </td>
                    <td className={styles.system}>
                      {system || 'Unknown'}
                    </td>
                    <td>
                      <PlatformBadge expansion={expansion} platform={platform} />
                      {codeRed && (<span className={clsx('badge', styles.crBadge)}>{'CR'}</span>)}
                    </td>
                    <RescueRatCell rescueId={rescue.id} />
                    <FirstLimpetCell rescue={rescue} />
                    <td>
                      {
                        statusInfo && (
                          <span className={clsx(styles.statusBadge, statusInfo.className)}>
                            {statusInfo.label}
                          </span>
                        )
                      }
                    </td>
                    <td>
                      {
                        outcomeInfo && (
                          <span className={clsx(styles.outcome, outcomeInfo.className)}>
                            <FontAwesomeIcon fixedWidth icon={outcomeInfo.icon} />
                            {' '}
                            {outcomeInfo.label}
                          </span>
                        )
                      }
                      {!outcomeInfo && outcome && (<span className={styles.outcome}>{outcome}</span>)}
                    </td>
                    <td className={styles.date}>
                      {formatAsEliteDateTime(createdAt)}
                    </td>
                    <CopyToClipboard as="td" className={styles.idCell} text={rescue.id}>
                      <code title={rescue.id}>{shortId}</code>
                    </CopyToClipboard>
                    <td className={styles.actionsCell}>
                      <Link
                        className={clsx('compact', styles.actionButton)}
                        href={makePaperworkRoute({ rescueId: rescue.id, from: 'admin' })}
                        title="View paperwork">
                        <FontAwesomeIcon fixedWidth icon="eye" />
                      </Link>
                      <Link
                        className={clsx('compact', styles.actionButton)}
                        href={makePaperworkRoute({ rescueId: rescue.id, edit: true, from: 'admin' })}
                        title="Edit paperwork">
                        <FontAwesomeIcon fixedWidth icon="pen" />
                      </Link>
                      <ConfirmActionButton
                        className="compact"
                        confirmButtonText="Delete"
                        confirmSubText="Delete rescue?"
                        denyButtonText="Cancel"
                        name={rescue.id}
                        onConfirm={
                          () => {
                            return handleDelete(rescue)
                          }
                        }
                        onConfirmText="">
                        <FontAwesomeIcon fixedWidth icon="trash" />
                      </ConfirmActionButton>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>

      {
        total > 0 && (
          <div className={styles.footer}>
            <span>{`${total} rescue${total === 1 ? '' : 's'}`}</span>
          </div>
        )
      }

      {
        totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onGenerateRoute={handleGenerateRoute} />
        )
      }
    </div>
  )
}

AdminRescues.getPageMeta = () => {
  return {
    title: 'Rescue Search',
    breadcrumbs: [{ label: 'Admin' }],
  }
}


export default authenticated('rescues.write')(AdminRescues)
