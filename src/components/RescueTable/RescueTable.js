import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import Link from 'next/link'
import { useSelector } from 'react-redux'

import RatName from '~/components/RatName'
import { selectRatsByRescueId } from '~/store/selectors'
import formatAsEliteDateTime from '~/util/date/formatAsEliteDateTime'
import makePaperworkRoute from '~/util/router/makePaperworkRoute'

import Pagination from '../Pagination'
import PlatformBadge from '../PlatformBadge'
import styles from './RescueTable.module.scss'



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


function RescueTable ({
  rescues,
  fetchError,
  total,
  page,
  totalPages,
  onGenerateRoute,
  paperworkFrom,
}) {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{'CMDR'}</th>
            <th>{'System'}</th>
            <th>{'Platform'}</th>
            <th>{'Rat'}</th>
            <th>{'Status'}</th>
            <th>{'Outcome'}</th>
            <th>{'Date'}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {
            (!rescues || rescues.length === 0) && (
              <tr>
                <td className={styles.empty} colSpan={8}>
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
                client, system, platform, expansion, outcome, codeRed, status, createdAt,
              } = rescue.attributes
              const outcomeInfo = outcomeLabels[outcome]
              const statusInfo = statusLabels[status]

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
                  <td className={styles.actions}>
                    <Link
                      className={styles.paperworkLink}
                      href={`${makePaperworkRoute({ rescueId: rescue.id })}${paperworkFrom ? `?from=${paperworkFrom}` : ''}`}
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
            onGenerateRoute={onGenerateRoute} />
        )
      }
    </div>
  )
}


export default RescueTable
