import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import CodeRedIcon from '~/components/Leaderboard/CodeRedIcon'
import FirstYearIcon from '~/components/Leaderboard/FirstYearIcon'
import RescueAchievementIcon from '~/components/Leaderboard/RescueAchievementIcon'
import Pagination from '~/components/Pagination/Pagination'
import styles from '~/scss/pages/leaderboard.module.scss'
import { getLeaderboard } from '~/store/actions/statistics'
import {
  selectLeaderboard,
  selectLeaderboardStatistics,
} from '~/store/selectors'
import makePaginatedRoute from '~/util/router/makePaginatedRoute'
import safeParseInt from '~/util/safeParseInt'





// Component constants
const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 25

const PAGE_SIZE_OPTIONS = [
  { value: 25, label: '25 Rows' },
  { value: 50, label: '50 Rows' },
  { value: 100, label: '100 Rows' },
]

function Leaderboard (props) {
  const page = safeParseInt(props.query.page) ?? DEFAULT_PAGE
  const pageSize = safeParseInt(props.query.limit) ?? DEFAULT_PAGE_SIZE

  const dispatch = useDispatch()
  const [retrieving, setRetrieving] = useState(false)
  const statistics = useSelector(selectLeaderboardStatistics)
  const entries = useSelector(selectLeaderboard)

  const [filterRat, setFilterRat] = useState('')

  const handleInputChange = (input) => {
    const searchTerm = input.target.value

    setFilterRat(searchTerm)
  }

  const handleGenerateRoute = (nextParams) => {
    return makePaginatedRoute('/leaderboard', nextParams)
  }

  useEffect(() => {
    const updateList = async () => {
      setRetrieving(true)

      await dispatch(getLeaderboard({
        page: {
          offset: Math.max((page - 1) * pageSize, 0),
          limit: pageSize,
        },
        filter: {
          name: filterRat.length > 0 ? `%${filterRat}%` : undefined,
        },
      }))

      setRetrieving(false)
    }

    updateList()
  }, [dispatch, filterRat, page, pageSize])

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
                placeholder="Filter Rat"
                type="text"
                value={filterRat}
                onChange={handleInputChange} />
            </div>
            <div className={styles.ratRescues}>
              {'Rescues'}
            </div>
            <div className={styles.ratBadges}>
              {'Badges'}
            </div>
          </div>
          <ol className="loading">
            {
              Boolean(!retrieving && entries.length) && entries.map((entry) => {
                return (
                  <li key={entry.id}>
                    <div className={styles.ratName}>
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
          </ol>
          <Pagination
            showPageInput
            defaultPageSize={DEFAULT_PAGE_SIZE}
            page={page}
            pageSize={pageSize}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            totalPages={statistics.lastPage}
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
