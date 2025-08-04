import { useRouter } from 'next/router'
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
const BASE_TEN_RADIX = 10
const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 25

function Leaderboard (props) {
  const page = safeParseInt(props.query.page) ?? DEFAULT_PAGE

  const dispatch = useDispatch()
  const [retrieving, setRetrieving] = useState(false)
  const statistics = useSelector(selectLeaderboardStatistics)
  const entries = useSelector(selectLeaderboard)

  const [filterRat, setFilterRat] = useState('')
  const [pageSize, setPageSize] = useState(props.query?.limit ?? DEFAULT_PAGE_SIZE)

  const router = useRouter()

  const handleInputChange = (input) => {
    const searchTerm = input.target.value

    setFilterRat(searchTerm)
  }

  const handleUpdatePageSize = (input) => {
    const newPageSize = input.target.value

    setPageSize(newPageSize)

    const newRoute = makePaginatedRoute({ route: 'leaderboard', page, limit: newPageSize })

    router.push(newRoute)
  }

  useEffect(() => {
    const updateList = async () => {
      setRetrieving(true)

      let leaderboardArgs = {
        page: {
          limit: pageSize,
        },
        filter: {
          name: filterRat.length > 0 ? `%${filterRat}%` : undefined,
        },
      }

      if (page > 1) {
        leaderboardArgs = {
          page: {
            offset: (page - 1) * pageSize,
            limit: pageSize,
          },
          filter: {
            name: filterRat.length > 0 ? `%${filterRat}%` : undefined,
          },
        }
      }

      await dispatch(getLeaderboard(leaderboardArgs))

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
            pageInput
            page={page}
            pageSize={Number(pageSize)}
            route="leaderboard"
            totalPages={statistics.lastPage}
            onUpdatePageSize={handleUpdatePageSize} />
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
