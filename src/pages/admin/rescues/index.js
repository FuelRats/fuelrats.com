import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import Link from 'next/link'
import {
  useCallback, useEffect, useMemo, useState,
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
import useUrlFilters from '~/hooks/useUrlFilters'
import { deleteRescue, getRescues } from '~/store/actions/rescues'
import {
  selectPageViewDataById, selectPageViewMetaById,
  selectRatsByRescueId, selectRatById,
  selectDisplayRatByUserId,
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


function ExpandedRescueRow ({ rescue }) {
  const rats = useSelector((state) => {
    return selectRatsByRescueId(state, { rescueId: rescue.id })
  })
  const firstLimpetId = rescue.relationships?.firstLimpet?.data?.id
  const dispatcherRats = useSelector((state) => {
    return (rescue.relationships?.dispatchers?.data ?? []).map(({ id }) => {
      return selectDisplayRatByUserId(state, { userId: id })
    }).filter(Boolean)
  })
  const lastEditRat = useSelector((state) => {
    const lastEditId = rescue.relationships?.lastEditUser?.data?.id
    return lastEditId ? selectDisplayRatByUserId(state, { userId: lastEditId }) : null
  })

  const {
    client, clientNick, clientLanguage, system, platform, expansion,
    outcome, status, codeRed, carrier, notes, quotes,
    createdAt, updatedAt, commandIdentifier, title,
  } = rescue.attributes

  let displayStatus = status
  let displayOutcome = outcome
  if (status === 'inactive') {
    displayStatus = 'open'
    displayOutcome = 'inactive'
  } else if (status === 'open') {
    displayOutcome = 'active'
  }

  return (
    <tr className={styles.expandedRow}>
      <td colSpan={10}>
        <div className={clsx('page paperwork', styles.expandedContent)}>
          <div className="rescue-tags">
            <div className="tag status-group">
              <span className={clsx('status', displayStatus)}>{displayStatus}</span>
              <span className="outcome">{displayOutcome || 'unfiled'}</span>
            </div>
            <div className={clsx('tag platform', platform ?? 'none')}>
              {platform || 'No Platform'}
            </div>
            {
              platform === 'pc' && expansion && (
                <div className="tag">{expansion}</div>
              )
            }
            {codeRed && (<div className="tag code-red">{'CR'}</div>)}
            {carrier && (<div className="tag">{'Carrier'}</div>)}
            {
              typeof commandIdentifier === 'number' && (
                <div className="tag">{`#${commandIdentifier}`}</div>
              )
            }
          </div>

          <div className={styles.expandedBody}>
            <div className="info">
              <span className="label">{'Client'}</span>
              <span className="cmdr-name">{client}</span>
              <span className="label">{'System'}</span>
              <span className="system">{system || 'Unknown'}</span>
              {
                clientNick && (
                  <>
                    <span className="label">{'IRC Nick'}</span>
                    <span>{clientNick}</span>
                  </>
                )
              }
              {
                clientLanguage && (
                  <>
                    <span className="label">{'Language'}</span>
                    <span>{clientLanguage}</span>
                  </>
                )
              }
              {
                title && (
                  <>
                    <span className="label">{'Title'}</span>
                    <span>{title}</span>
                  </>
                )
              }
              <span className="label">{'Created'}</span>
              <span>{formatAsEliteDateTime(createdAt)}</span>
              <span className="label">{'Updated'}</span>
              <span>{formatAsEliteDateTime(updatedAt)}</span>
              {
                dispatcherRats.length > 0 && (
                  <>
                    <span className="label">{'Dispatcher'}</span>
                    <span>
                      {
                        dispatcherRats.map((rat) => {
                          return <RatName key={rat.id} rat={rat} size={18} />
                        })
                      }
                    </span>
                  </>
                )
              }
              {
                lastEditRat && (
                  <>
                    <span className="label">{'Last Edit'}</span>
                    <span><RatName rat={lastEditRat} size={18} /></span>
                  </>
                )
              }
              <span className="label">{'ID'}</span>
              <CopyToClipboard text={rescue.id}>
                <code>{rescue.id}</code>
              </CopyToClipboard>
            </div>

            <div className="panel rats">
              <header>{'Rats'}</header>
              <div className="panel-content">
                <ul>
                  {
                    rats?.map((rat) => {
                      return (
                        <li key={rat.id}>
                          <RatName rat={rat} size={20}>
                            {rat.id === firstLimpetId && (<span className="badge first-limpet">{'1st'}</span>)}
                          </RatName>
                        </li>
                      )
                    })
                  }
                </ul>
                {(!rats || rats.length === 0) && <span>{'No rats assigned'}</span>}
              </div>
            </div>
          </div>

          {
            quotes?.length > 0 && (
              <div className="panel quotes">
                <header>{`Quotes (${quotes.length})`}</header>
                <div className="panel-content">
                  <ol>
                    {
                      quotes.map((quote) => {
                        return (
                          <li key={quote.createdAt}>
                            <div className="times">
                              <div className="created">{formatAsEliteDateTime(quote.createdAt)}</div>
                            </div>
                            <span className="message">{quote.message}</span>
                            <div className="authors">
                              <div className="author">{quote.author}</div>
                            </div>
                          </li>
                        )
                      })
                    }
                  </ol>
                </div>
              </div>
            )
          }

          {
            notes && outcome !== 'purge' && (
              <div className="panel notes">
                <header>{'Notes'}</header>
                <div className="panel-content">{notes}</div>
              </div>
            )
          }
        </div>
      </td>
    </tr>
  )
}


function AdminRescues () {
  const dispatch = useDispatch()

  const {
    filters, setFilter, page, hasUrlFilters, syncUrl, handleGenerateRoute,
  } = useUrlFilters(initialRescueFilters, rescueFilterReducer, '/admin/rescues')

  const offset = (page - 1) * PAGE_SIZE
  const [fetchError, setFetchError] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [debouncedFilters, setDebouncedFilters] = useState(filters)
  const [showFilters, setShowFilters] = useState(hasUrlFilters)

  const [filterRat, setFilterRat] = useState(null)
  const [filterFirstLimpet, setFilterFirstLimpet] = useState(null)

  const applyFilters = useDebouncedCallback((nextFilters) => {
    setDebouncedFilters(nextFilters)
    syncUrl(nextFilters)
  }, [syncUrl], SEARCH_DEBOUNCE_MS)

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
                const isExpanded = expandedId === rescue.id

                return [
                  <tr
                    key={rescue.id}
                    className={clsx({ [styles.codeRed]: codeRed, [styles.expandedRowActive]: isExpanded })}>
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
                        target="_blank"
                        title="View paperwork">
                        <FontAwesomeIcon fixedWidth icon="eye" />
                      </Link>
                      <Link
                        className={clsx('compact', styles.actionButton)}
                        href={makePaperworkRoute({ rescueId: rescue.id, edit: true, from: 'admin' })}
                        target="_blank"
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
                      <button
                        className={clsx('compact', styles.actionButton)}
                        title={isExpanded ? 'Collapse' : 'Details'}
                        type="button"
                        onClick={
                          () => {
                            return setExpandedId(isExpanded ? null : rescue.id)
                          }
                        }>
                        <FontAwesomeIcon fixedWidth icon={isExpanded ? 'chevron-up' : 'chevron-down'} />
                      </button>
                    </td>
                  </tr>,
                  isExpanded && (
                    <ExpandedRescueRow key={`${rescue.id}-detail`} rescue={rescue} />
                  ),
                ]
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
