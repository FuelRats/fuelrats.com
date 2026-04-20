import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getMyRescues } from '~/store/actions/rescues'
import { selectPageViewDataById } from '~/store/selectors'
import formatAsEliteDateTime from '~/util/date/formatAsEliteDateTime'
import makePaperworkRoute from '~/util/router/makePaperworkRoute'

import styles from './UnfiledRescuesPanel.module.scss'



const PAGE_VIEW_ID = 'unfiled-rescues'
const DAYS_LOOKBACK = 30
const THIRTY_DAYS_MS = DAYS_LOOKBACK * 24 * 60 * 60 * 1000
const TWO_HOURS_MS = 2 * 60 * 60 * 1000
const MAX_UNFILED = 50


function UnfiledRescuesPanel () {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  const rescues = useSelector((state) => {
    return selectPageViewDataById(state, { pageViewId: PAGE_VIEW_ID })
  })

  useEffect(() => {
    const now = Date.now()
    const thirtyDaysAgo = new Date(now - THIRTY_DAYS_MS).toISOString()
    const twoHoursAgo = new Date(now - TWO_HOURS_MS).toISOString()

    const filter = {
      status: { eq: 'closed' },
      outcome: { is: null },
      createdAt: {
        gte: thirtyDaysAgo,
        lt: twoHoursAgo,
      },
    }

    Promise.resolve(dispatch(getMyRescues(
      {
        filter: JSON.stringify(filter),
        _firstLimpet: 'me',
        sort: '-createdAt',
        'page[limit]': MAX_UNFILED,
      },
      {
        pageView: {
          id: PAGE_VIEW_ID,
          type: 'rescues',
        },
      },
    ))).then(() => {
      setLoading(false)
    })
  }, [dispatch])

  if (loading) {
    return null
  }

  if (!rescues || rescues.length === 0) {
    return null
  }

  return (
    <div className="panel">
      <header className={styles.header}>
        <FontAwesomeIcon fixedWidth icon="exclamation-triangle" />
        {` Unfiled Paperwork (${rescues.length})`}
      </header>
      <div className={styles.content}>
        <p className={styles.description}>
          {'You have rescues that need paperwork filed. Please complete them as soon as possible.'}
        </p>
        <ul className={styles.rescueList}>
          {
            rescues.map((rescue) => {
              const { client, system, createdAt } = rescue.attributes
              return (
                <li key={rescue.id} className={styles.rescueItem}>
                  <Link
                    className={styles.rescueLink}
                    href={makePaperworkRoute({ rescueId: rescue.id, edit: true })}>
                    <span className={styles.client}>
                      {'CMDR '}
                      {client}
                    </span>
                    {
                      system && (
                        <span className={styles.system}>
                          {' in '}
                          {system}
                        </span>
                      )
                    }
                    <span className={styles.date}>
                      {formatAsEliteDateTime(createdAt)}
                    </span>
                    <FontAwesomeIcon fixedWidth className={styles.arrow} icon="arrow-right" />
                  </Link>
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  )
}


export default UnfiledRescuesPanel
