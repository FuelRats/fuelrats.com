import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  useCallback, useEffect, useReducer, useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useDebouncedCallback from '~/hooks/useDebouncedCallback'
import { getMyRescues } from '~/store/actions/rescues'
import { selectPageViewDataById, selectPageViewMetaById, selectRatsByRescueId } from '~/store/selectors'
import formatAsEliteDateTime from '~/util/date/formatAsEliteDateTime'
import makePaperworkRoute from '~/util/router/makePaperworkRoute'

import Pagination from './Pagination'
import PlatformBadge from './PlatformBadge'
import styles from './UserRescuesPanel.module.scss'




const PAGE_VIEW_ID = 'user-rescues'
const PAGE_SIZE = 25
const SEARCH_DEBOUNCE_MS = 500

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Created (newest)' },
  { value: 'createdAt', label: 'Created (oldest)' },
  { value: '-updatedAt', label: 'Updated (newest)' },
  { value: 'updatedAt', label: 'Updated (oldest)' },
  { value: 'client', label: 'Client (A-Z)' },
  { value: '-client', label: 'Client (Z-A)' },
  { value: 'system', label: 'System (A-Z)' },
  { value: '-system', label: 'System (Z-A)' },
]

const PLATFORM_OPTIONS = [
  { value: 'pc', label: 'PC', icon: 'tv' },
  { value: 'xb', label: 'XB', icon: ['fab', 'xbox'] },
  { value: 'ps', label: 'PS', icon: ['fab', 'playstation'] },
]
const EXPANSION_OPTIONS = [
  { value: 'horizons3', label: 'Legacy' },
  { value: 'horizons4', label: 'Horizons' },
  { value: 'odyssey', label: 'Odyssey' },
]
const OUTCOME_OPTIONS = [
  { value: 'success', label: 'Success' },
  { value: 'failure', label: 'Failure' },
  { value: 'invalid', label: 'Invalid' },
  { value: 'other', label: 'Other' },
  { value: 'purge', label: 'Trash' },
]


const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'closed', label: 'Closed' },
]

const initialFilters = {
  client: '',
  system: '',
  platform: '',
  expansion: '',
  outcome: '',
  status: '',
  codeRed: '',
  carrier: '',
  firstLimpet: '',
  notes: '',
  sort: '-createdAt',
}

function filterReducer (state, action) {
  if (action.type === 'reset') {
    return initialFilters
  }
  return { ...state, [action.field]: action.value }
}

function RescueRatCell ({ rescueId }) {
  const rats = useSelector((state) => {
    return selectRatsByRescueId(state, { rescueId })
  })
  return (
    <td className={styles.rats}>
      {
rats?.map((rat) => {
  return rat.attributes.name
}).join(', ') || '-'
}
    </td>
  )
}

const outcomeLabels = {
  success: { label: 'Success', icon: 'circle-check', className: styles.success },
  failure: { label: 'Failure', icon: 'circle-xmark', className: styles.failure },
  invalid: { label: 'Invalid', icon: 'triangle-exclamation', className: styles.invalid },
  other: { label: 'Other', icon: 'circle-exclamation', className: styles.other },
  purge: { label: 'Trash', icon: 'trash', className: styles.other },
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

function UserRescuesPanel () {
  const dispatch = useDispatch()
  const page = useQueryPage()
  const offset = (page - 1) * PAGE_SIZE
  const [fetchError, setFetchError] = useState(false)
  const [filters, setFilter] = useReducer(filterReducer, initialFilters)
  const [debouncedFilters, setDebouncedFilters] = useState(initialFilters)
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
    const filter = {}
    if (debouncedFilters.client.trim()) {
      filter.client = { iLike: `%${debouncedFilters.client.trim()}%` }
    }
    if (debouncedFilters.system.trim()) {
      filter.system = { iLike: `%${debouncedFilters.system.trim()}%` }
    }
    if (debouncedFilters.platform) {
      filter.platform = debouncedFilters.platform
    }
    if (debouncedFilters.expansion) {
      filter.expansion = debouncedFilters.expansion
    }
    if (debouncedFilters.outcome) {
      filter.outcome = debouncedFilters.outcome
    } else {
      filter.outcome = { ne: 'purge' }
    }
    if (debouncedFilters.status) {
      filter.status = debouncedFilters.status
    }
    if (debouncedFilters.codeRed) {
      filter.codeRed = debouncedFilters.codeRed === 'yes'
    }
    if (debouncedFilters.carrier) {
      filter.carrier = debouncedFilters.carrier === 'yes'
    }
    if (debouncedFilters.notes.trim()) {
      filter.notes = { iLike: `%${debouncedFilters.notes.trim()}%` }
    }

    const params = {
      sort: debouncedFilters.sort,
      include: 'rats',
      'page[offset]': offset,
      'page[limit]': PAGE_SIZE,
      filter: JSON.stringify(filter),
    }
    if (debouncedFilters.firstLimpet) {
      params._firstLimpet = 'me'
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

  const handleResetFilters = useCallback(() => {
    setFilter({ type: 'reset' })
  }, [])

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
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <div className={styles.searchRow}>
          <FontAwesomeIcon className={styles.searchIcon} icon="search" />
          <input
            aria-label="Search by CMDR"
            className={styles.searchInput}
            placeholder="Search by CMDR name..."
            type="text"
            value={filters.client}
            onChange={
              (event) => {
                return setFilter({ field: 'client', value: event.target.value })
              }
            } />
          <button
            aria-label="Advanced filters"
            className={styles.filterToggle}
            title="Advanced filters"
            type="button"
            onClick={
              () => {
                return setShowFilters((prev) => {
                  return !prev
                })
              }
            }>
            <FontAwesomeIcon icon="sliders" />
          </button>
        </div>
        {
          showFilters && (
            <div className={styles.filterPanel}>
              <label className={styles.filterField}>
                <span>{'System'}</span>
                <input
                  aria-label="System"
                  placeholder="e.g. SOL"
                  type="text"
                  value={filters.system}
                  onChange={
                    (event) => {
                      return setFilter({ field: 'system', value: event.target.value })
                    }
                  } />
              </label>

              <div className={styles.filterRow}>
                <span className={styles.filterLabel}>{'Platform'}</span>
                <div className={styles.chipGroup}>
                  {
                    PLATFORM_OPTIONS.map((plat) => {
                      return (
                        <button
                          key={plat.value}
                          className={clsx(styles.chip, { [styles.chipActive]: filters.platform === plat.value })}
                          type="button"
                          onClick={
                            () => {
                              return setFilter({
                                field: 'platform',
                                value: filters.platform === plat.value ? '' : plat.value,
                              })
                            }
                          }>
                          <FontAwesomeIcon fixedWidth icon={plat.icon} />
                          {` ${plat.label}`}
                        </button>
                      )
                    })
                  }
                </div>
              </div>

              <div className={styles.filterRow}>
                <span className={styles.filterLabel}>{'Game Mode'}</span>
                <div className={styles.chipGroup}>
                  {
                    EXPANSION_OPTIONS.map((exp) => {
                      return (
                        <button
                          key={exp.value}
                          className={clsx(styles.chip, { [styles.chipActive]: filters.expansion === exp.value })}
                          type="button"
                          onClick={
                            () => {
                              return setFilter({
                                field: 'expansion',
                                value: filters.expansion === exp.value ? '' : exp.value,
                              })
                            }
                          }>
                          {exp.label}
                        </button>
                      )
                    })
                  }
                </div>
              </div>

              <div className={styles.filterRow}>
                <span className={styles.filterLabel}>{'Status'}</span>
                <div className={styles.chipGroup}>
                  {
                    STATUS_OPTIONS.map((st) => {
                      return (
                        <button
                          key={st.value}
                          className={clsx(styles.chip, { [styles.chipActive]: filters.status === st.value })}
                          type="button"
                          onClick={
                            () => {
                              return setFilter({
                                field: 'status',
                                value: filters.status === st.value ? '' : st.value,
                              })
                            }
                          }>
                          {st.label}
                        </button>
                      )
                    })
                  }
                </div>
              </div>

              <div className={styles.filterRow}>
                <span className={styles.filterLabel}>{'Outcome'}</span>
                <div className={styles.chipGroup}>
                  {
                    OUTCOME_OPTIONS.map((oc) => {
                      const isActive = filters.outcome === oc.value
                      return (
                        <button
                          key={oc.value}
                          className={clsx(styles.chip, { [styles.chipActive]: isActive })}
                          type="button"
                          onClick={
                            () => {
                              return setFilter({
                                field: 'outcome',
                                value: isActive ? '' : oc.value,
                              })
                            }
                          }>
                          {oc.label}
                        </button>
                      )
                    })
                  }
                </div>
              </div>

              <div className={styles.filterInputRow}>
                <label className={styles.filterField}>
                  <span>{'Notes'}</span>
                  <input
                    aria-label="Notes"
                    placeholder="Search notes..."
                    type="text"
                    value={filters.notes}
                    onChange={
                      (event) => {
                        return setFilter({ field: 'notes', value: event.target.value })
                      }
                    } />
                </label>
              </div>

              <div className={styles.filterFooter}>
                <button
                  className={clsx(styles.chip, styles.crChip, { [styles.chipActive]: filters.codeRed === 'yes' })}
                  type="button"
                  onClick={
                    () => {
                      return setFilter({
                        field: 'codeRed',
                        value: filters.codeRed === 'yes' ? '' : 'yes',
                      })
                    }
                  }>
                  {'Code Red only'}
                </button>

                <button
                  className={clsx(styles.chip, { [styles.chipActive]: filters.carrier === 'yes' })}
                  type="button"
                  onClick={
                    () => {
                      return setFilter({
                        field: 'carrier',
                        value: filters.carrier === 'yes' ? '' : 'yes',
                      })
                    }
                  }>
                  {'Carrier only'}
                </button>

                <button
                  className={clsx(styles.chip, { [styles.chipActive]: filters.firstLimpet === 'yes' })}
                  type="button"
                  onClick={
                    () => {
                      return setFilter({
                        field: 'firstLimpet',
                        value: filters.firstLimpet === 'yes' ? '' : 'yes',
                      })
                    }
                  }>
                  {'First limpet'}
                </button>

                <label className={styles.sortField}>
                  <span>{'Sort'}</span>
                  <select
                    value={filters.sort}
                    onChange={
                      (event) => {
                        return setFilter({ field: 'sort', value: event.target.value })
                      }
                    }>
                    {
                      SORT_OPTIONS.map((opt) => {
                        return <option key={opt.value} value={opt.value}>{opt.label}</option>
                      })
                    }
                  </select>
                </label>

                <button
                  className={styles.resetButton}
                  type="button"
                  onClick={handleResetFilters}>
                  {'Reset'}
                </button>
              </div>
            </div>
          )
        }
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{'CMDR'}</th>
            <th>{'System'}</th>
            <th>{'Platform'}</th>
            <th>{'Rat'}</th>
            <th>{'Outcome'}</th>
            <th>{'Date'}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {
            (!rescues || rescues.length === 0) && (
              <tr>
                <td className={styles.empty} colSpan={7}>
                  {fetchError && 'Failed to load rescues.'}
                  {!fetchError && rescues && 'No rescues found.'}
                  {!fetchError && !rescues && 'Loading...'}
                </td>
              </tr>
            )
          }
          {
            rescues?.map((rescue) => {
              const {
                client, system, platform, expansion, outcome, codeRed, createdAt,
              } = rescue.attributes
              const outcomeInfo = outcomeLabels[outcome]

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
                  <td className={styles.actions}>
                    <Link
                      className={styles.paperworkLink}
                      href={`${makePaperworkRoute({ rescueId: rescue.id })}?from=profile`}
                      title="View paperwork">
                      <FontAwesomeIcon fixedWidth icon="arrow-right" />
                    </Link>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>

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




export default UserRescuesPanel
