import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getMyRescues } from '~/store/actions/rescues'
import { selectPageViewDataById, selectPageViewMetaById, selectRatsByRescueId } from '~/store/selectors'
import formatAsEliteDateTime from '~/util/date/formatAsEliteDateTime'
import makePaperworkRoute from '~/util/router/makePaperworkRoute'

import Pagination from './Pagination'
import PlatformBadge from './PlatformBadge'

import styles from './UserRescuesPanel.module.scss'
import clsx from 'clsx'




const PAGE_VIEW_ID = 'user-rescues'
const PAGE_SIZE = 25

function RescueRatCell ({ rescueId }) {
  const rats = useSelector((state) => {
    return selectRatsByRescueId(state, { rescueId })
  })
  return (
    <td className={styles.rats}>
      {rats?.map((rat) => { return rat.attributes.name }).join(', ') || '-'}
    </td>
  )
}

const outcomeLabels = {
  success: { label: 'Success', icon: 'circle-check', className: styles.success },
  failure: { label: 'Failure', icon: 'circle-xmark', className: styles.failure },
  invalid: { label: 'Invalid', icon: 'triangle-exclamation', className: styles.invalid },
  other: { label: 'Other', icon: 'circle-exclamation', className: styles.other },
}


function useQueryPage () {
  const router = useRouter()
  const [page, setPage] = useState(1)

  useEffect(() => {
    const handleRouteChange = (url) => {
      const match = url.match(/[?&]rpage=(\d+)/)
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

  const rescues = useSelector((state) => {
    return selectPageViewDataById(state, { pageViewId: PAGE_VIEW_ID })
  })
  const meta = useSelector((state) => {
    return selectPageViewMetaById(state, { pageViewId: PAGE_VIEW_ID })
  })

  useEffect(() => {
    dispatch(getMyRescues(
      {
        sort: '-createdAt',
        include: 'rats',
        'page[offset]': offset,
        'page[limit]': PAGE_SIZE,
      },
      {
        pageView: {
          id: PAGE_VIEW_ID,
          type: 'rescues',
        },
      },
    ))
  }, [dispatch, offset])

  const total = meta?.total ?? meta?.count ?? 0
  const totalPages = total ? Math.ceil(total / PAGE_SIZE) : (rescues?.length === PAGE_SIZE ? page + 1 : page)


  const handleGenerateRoute = useCallback(({ page: nextPage }) => {
    return nextPage > 1 ? `/profile/rescues?rpage=${nextPage}` : '/profile/rescues'
  }, [])

  return (
    <div className={styles.container}>
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
                  {rescues ? 'No rescues found.' : 'Loading...'}
                </td>
              </tr>
            )
          }
          {
            rescues?.map((rescue) => {
              const { client, system, platform, expansion, outcome, codeRed, createdAt } = rescue.attributes
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
