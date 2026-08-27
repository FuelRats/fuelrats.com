import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import CodeRedIcon from '~/components/Leaderboard/CodeRedIcon'
import FirstYearIcon from '~/components/Leaderboard/FirstYearIcon'
import RescueAchievementIcon from '~/components/Leaderboard/RescueAchievementIcon'
import Pagination from '~/components/Pagination/Pagination'
import UserAvatar from '~/components/UserAvatar'
import useDebouncedCallback from '~/hooks/useDebouncedCallback'
import styles from '~/scss/pages/leaderboard.module.scss'
import { getLeaderboard } from '~/store/actions/statistics'
import {
  selectLeaderboard,
  selectLeaderboardStatistics,
} from '~/store/selectors'
import makePaginatedRoute from '~/util/router/makePaginatedRoute'
import safeParseInt from '~/util/safeParseInt'

const noResultsTexts = [
  'No rodents found. Try adjusting your search.',
  'No rats detected. Broaden your search criteria.',
  'The search party returned empty-handed. Try again.',
  'Prospector limpet failed. Try a different angle.',
  'You\'ll find no rodents here, Commander. Attempt your inquiry elsewhere.',
  'No rats were located in this sector. Please modify your search parameters.',
  'No rodents detected. Perhaps they\'re in silent running?',
]
const getRandomNoResultsText = () => {
  const index = Math.floor(Math.random() * noResultsTexts.length)
  return noResultsTexts[index]
}


// Component constants
const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 25
const SEARCH_DEBOUNCE_DELAY = 750

const PAGE_SIZE_OPTIONS = [
  { value: 25, label: '25 Rats' },
  { value: 50, label: '50 Rats' },
  { value: 100, label: '100 Rats' },
]

function Leaderboard (props) {
  const page = safeParseInt(props.query.page) ?? DEFAULT_PAGE
  const pageSize = safeParseInt(props.query.limit) ?? DEFAULT_PAGE_SIZE
  const { filter: filterRat = '' } = props.query

  const router = useRouter()
  const dispatch = useDispatch()

  const [retrieving, setRetrieving] = useState(false)
  const [fetchError, setFetchError] = useState(false)
  const [retryNonce, setRetryNonce] = useState(0)
  const [noResultsText, setNoResultsText] = useState('')
  const statistics = useSelector(selectLeaderboardStatistics)
  const entries = useSelector(selectLeaderboard)

  const handleGenerateRoute = useCallback((nextParams) => {
    return makePaginatedRoute(
      '/leaderboard',
      { filter: filterRat.trim(), ...nextParams },
    )
  }, [filterRat])

  const updateFilter = useDebouncedCallback((nextFilter) => {
    if (nextFilter === filterRat) {
      return
    }

    router.push(handleGenerateRoute({
      limit: pageSize === DEFAULT_PAGE_SIZE ? undefined : pageSize,
      filter: nextFilter?.trim() || undefined,
    }), undefined)
  }, [filterRat, handleGenerateRoute, pageSize, router], SEARCH_DEBOUNCE_DELAY)


  const handleInputChange = (event) => {
    updateFilter(event.target.value)
  }

  const handleRetry = useCallback(() => {
    setRetryNonce((nonce) => {
      return nonce + 1
    })
  }, [])

  useEffect(() => {
    const updateList = async () => {
      setRetrieving(true)
      setFetchError(false)
      const result = await dispatch(getLeaderboard({
        page: {
          offset: Math.max((page - 1) * pageSize, 0),
          limit: pageSize,
        },
        filter: {
          name: filterRat.length > 0 ? `%${filterRat}%` : undefined,
        },
      }))
      if (result?.error) {
        setFetchError(true)
      }
      setNoResultsText(getRandomNoResultsText())
      setRetrieving(false)
    }

    updateList()
  }, [dispatch, filterRat, page, pageSize, retryNonce])

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      updateFilter.flush()
    }
  }

  return (
    <div className="page-content">
      <section className="panel">
        <div className={styles.ratLeaderboard}>
          <div className={styles.ratLeaderboardHeader}>
            <div className={styles.ratName}>
              {'Name'}
              <input
                aria-label="Filter Rat"
                className={styles.filterRat}
                defaultValue={filterRat}
                disabled={retrieving}
                placeholder="Filter Rats"
                type="text"
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown} />
            </div>
            <div className={styles.ratRescues}>
              {'Rescues'}
            </div>
            <div className={styles.ratBadges}>
              {'Badges'}
            </div>
          </div>
          <ol className={clsx('loading', { 'loader-force': retrieving })}>
            {
              retrieving && Array(pageSize).fill(undefined).map((_, idx) => {
                return (
                  // eslint-disable-next-line react/no-array-index-key -- only key we have
                  <li key={idx}>
                    <div className={styles.ratName}>
                      {''}
                    </div>
                  </li>
                )
              })
            }
            {
              Boolean(!retrieving && entries.length) && entries.map((entry) => {
                return (
                  <li key={entry.id}>
                    <div
                      className={styles.ratName}
                      title={entry.attributes.ratNames?.length > 1 ? entry.attributes.ratNames.join(', ') : undefined}>
                      <UserAvatar
                        alt=""
                        size={32}
                        style={{ borderRadius: '50%', flexShrink: 0 }}
                        userId={entry.attributes.odpiUserId ?? entry.id} />
                      {entry.attributes.preferredName}
                    </div>
                    <div className={styles.ratRescues}>
                      {entry.attributes.rescueCount}
                    </div>
                    <div className={styles.ratBadges}>
                      <RescueAchievementIcon className="size-32 fixed" rescueCount={entry.attributes.rescueCount} />
                      <CodeRedIcon className="size-32 fixed" codeRedCount={entry.attributes.codeRedCount} />
                      <FirstYearIcon className="size-32 fixed" createdAt={entry.attributes.joinedAt} />
                    </div>
                  </li>
                )
              })
            }
            {
              Boolean(!retrieving && fetchError) && (
                <li className={styles.noResults}>
                  <div className={styles.ratName}>
                    {'Failed to load leaderboard. '}
                    <button
                      className="button link"
                      type="button"
                      onClick={handleRetry}>
                      {'Try again'}
                    </button>
                  </div>
                </li>
              )
            }
            {
              Boolean(!retrieving && !fetchError && !entries.length) && (
                <li className={styles.noResults}>
                  <div className={styles.ratName}>
                    {noResultsText}
                  </div>
                </li>
              )
            }
          </ol>
          <Pagination
            showPageInput
            defaultPageSize={DEFAULT_PAGE_SIZE}
            page={page}
            pageSize={pageSize}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            totalPages={statistics.lastPage || 1}
            onGenerateRoute={handleGenerateRoute} />
        </div>
      </section>
    </div>
  )
}

Leaderboard.getPageMeta = () => {
  return {
    title: 'Leaderboard',
    description: 'Our leaderboard tracks in-game spaceship rescues, showcasing individual accomplishments and contributions of our top rescuers.',
  }
}





export default Leaderboard
