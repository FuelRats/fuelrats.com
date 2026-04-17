import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { cloneElement, useCallback, useMemo, useState, Fragment } from 'react'

import {
  useRescuePlatform, useRescueLanguage, useRescuePermit, useRescueLandmark, useRescueHasScoopableStar,
  useRescueMainStarDescription,
} from '~/hooks/rescueHooks'
import { createSelectRenderedRatList } from '~/store/selectors'
import formatAsEliteDateTime from '~/util/date/formatAsEliteDateTime'
import formatQuoteTime from '~/util/date/formatQuoteTime'
import { expansionLongNameMap } from '~/util/expansion'
import makePaperworkRoute from '~/util/router/makePaperworkRoute'
import { getEdsmSystemUrl, getSpanshPlotUrl } from '~/util/system/externalLinks'

import CarrierIcon from '../CarrierIcon'
import CopyToClipboard from '../CopyToClipboard'
import PlatformBadge from '../PlatformBadge'
import RatName from '../RatName'
import ElapsedTimer from '../ElapsedTimer'
import styles from './RescueDetails.module.scss'
import clsx from 'clsx'





const selectRenderedRatList = createSelectRenderedRatList((rat, index) => {
  return (
    <tr key={rat.id}>
      {
        index === 0
          ? (<td className={styles.infoTitle}>{'Rats'}</td>)
          : (<td />)
      }
      <td className={clsx(styles.infoValue, styles.infoGroup)}>
        <RatName rat={rat} size={22} />
      </td>
    </tr>
  )
})





function RescueDetailsContent (props) {
  const { rescue } = props
  const {
    commandIdentifier,
    client,
    clientNick,
    codeRed,
    expansion,
    system,
    status,
    platform,
    clientLanguage,
    createdAt,
    title,
    quotes,
    carrier,
  } = rescue.attributes

  const rescueLanguage = useRescueLanguage(rescue)
  const rescuePlatform = useRescuePlatform(rescue)
  const rescueRats = useSelector((state) => {
    return selectRenderedRatList(state, { rescueId: rescue.id })
  })
  const rescuePermit = useRescuePermit(rescue)
  const rescueLandmark = useRescueLandmark(rescue)
  const rescueHasScoopableStar = useRescueHasScoopableStar(rescue)
  const rescueMainStarDescription = useRescueMainStarDescription(rescue)
  const landmarkDistance = rescue.attributes.data?.landmark?.distance
  const edsmUrl = useMemo(() => {
    return getEdsmSystemUrl(system)
  }, [system])
  const spanshUrl = useMemo(() => {
    if (typeof landmarkDistance !== 'number' || landmarkDistance < 2000) {
      return null
    }
    return getSpanshPlotUrl(system)
  }, [system, landmarkDistance])

  const parsedQuotes = useMemo(() => {
    return quotes.map((quote, originalIndex) => {
      const [isViaAuthor, quoteSender, quoteMessage] = quote.message.match(/^<(.*)>\s(.*)/u)
        ?? [false, quote.lastAuthor ?? quote.author, quote.message]
      return {
        quote,
        originalIndex,
        isViaAuthor,
        quoteSender,
        quoteMessage,
        isEvent: quoteSender === 'MechaSqueak[BOT]',
      }
    })
  }, [quotes])

  const quoteGroups = useMemo(() => {
    const groups = []
    let current = null
    parsedQuotes.forEach((item) => {
      if (current && current.isEvent === item.isEvent) {
        current.items.push(item)
      } else {
        current = { isEvent: item.isEvent, items: [item] }
        groups.push(current)
      }
    })
    return groups
  }, [parsedQuotes])

  const [expandedGroups, setExpandedGroups] = useState(() => new Set())
  const toggleGroup = useCallback((groupKey) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(groupKey)) {
        next.delete(groupKey)
      } else {
        next.add(groupKey)
      }
      return next
    })
  }, [])

  // const router = useRouter()
  // const handleCloseRescueDetails = useCallback(() => {
  //   router.push('/dispatch')
  // }, [router])

  return (
    <div className={styles.rescueDetails}>
      <div className={styles.header}>
        <div className={styles.title}>
          {`${typeof commandIdentifier === 'number' ? `#${commandIdentifier} - ` : ''}${title ?? client}`}
          {
            platform && (
              <PlatformBadge className={styles.titlePlatformBadge} expansion={expansion} platform={platform} />
            )
          }
          {codeRed && <span className="badge">{'CODE RED'}</span>}
          {status === 'inactive' && <span className="badge warn">{'Inactive'}</span>}
        </div>
        <div className={styles.timer}>
          <ElapsedTimer from={createdAt} />
          {/* <button
            readOnly
            aria-label={`Hide detail view for rescue of ${client}`}
            className={[styles.closeButton, 'icon']}
            name="detail"
            title="Close details"
            type="button"
            onClick={handleCloseRescueDetails}>
            <FontAwesomeIcon fixedWidth icon="xmark" />
          </button> */}
        </div>

      </div>
      <table className={styles.body}>
        <thead>
          <tr>
            <td width="90px" />
            <td />
          </tr>
        </thead>
        <tbody>
          {
            clientNick && (
              <tr>
                <td className={styles.infoTitle}>{'IRC Nick'}</td>
                <td className={styles.infoValue}>
                  <CopyToClipboard doHint text={clientNick}>
                    {clientNick}
                  </CopyToClipboard>
                </td>
              </tr>
            )
          }
          {
            system && (
              <tr>
                <td className={styles.infoTitle}>{'System'}</td>
                <td className={clsx(styles.infoValue, styles.systemRow)}>
                  <span className={styles.systemInfo}>
                    <CopyToClipboard doHint text={system}>
                      {system}
                    </CopyToClipboard>
                    {
                      rescueHasScoopableStar && (
                        <FontAwesomeIcon
                          className={styles.scoopable}
                          icon="gas-pump"
                          title={rescueHasScoopableStar} />
                      )
                    }
                    {
                      rescueMainStarDescription && (
                        <span className={styles.starDescription}>
                          {rescueMainStarDescription}
                        </span>
                      )
                    }
                    {
                      rescueLandmark && (
                        <span className={styles.landmark}>
                          {rescueLandmark}
                        </span>
                      )
                    }
                  </span>
                  <span className={styles.systemBadges}>
                    {
                      rescuePermit && (
                        <span className={styles.permitBadge} title={rescuePermit}>
                          <FontAwesomeIcon icon="lock" />
                          {' Permit Required'}
                        </span>
                      )
                    }
                    {edsmUrl && (
                      <a
                        className={styles.systemLink}
                        href={edsmUrl}
                        rel="noreferrer"
                        target="_blank"
                        title="View on EDSM">
                        {'EDSM'}
                        <FontAwesomeIcon className={styles.systemLinkIcon} icon="up-right-from-square" />
                      </a>
                    )}
                    {spanshUrl && (
                      <a
                        className={styles.systemLink}
                        href={spanshUrl}
                        rel="noreferrer"
                        target="_blank"
                        title="Plot route on Spansh">
                        {'Spansh'}
                        <FontAwesomeIcon className={styles.systemLinkIcon} icon="up-right-from-square" />
                      </a>
                    )}
                  </span>
                </td>
              </tr>
            )
          }
          {
            platform && (
              <tr>
                <td className={styles.infoTitle}>{'Platform'}</td>
                <td className={styles.infoValue}>
                  <span>
                    {rescuePlatform.long}
                    {platform === 'pc' && expansion && (
                      <span className={clsx('badge', styles.expansionBadge, expansion)}>
                        {expansionLongNameMap[expansion] ?? expansion}
                      </span>
                    )}
                  </span>
                </td>
              </tr>
            )
          }
          {
            clientLanguage && (
              <tr>
                <td className={styles.infoTitle}>{'Language'}</td>
                <td className={styles.infoValue}>
                  <span>
                    {rescueLanguage.long}
                    {rescueLanguage.region && (
                      <span className={styles.languageRegion}>
                        {rescueLanguage.flag && (
                          <span className={styles.languageFlag}>{rescueLanguage.flag}</span>
                        )}
                        {rescueLanguage.region}
                      </span>
                    )}
                  </span>
                </td>
              </tr>
            )
          }
          <tr>
            <td className={styles.infoTitle}>{'UUID'}</td>
            <td className={styles.infoValue}>
              <CopyToClipboard doHint text={`https://fuelrats.com/paperwork/${rescue.id}`}>
                {rescue.id}
              </CopyToClipboard>
              <Link className={clsx('button', styles.paperworkButton)} href={makePaperworkRoute({ rescueId: rescue.id, edit: true, from: 'dispatch' })}>
                <FontAwesomeIcon fixedWidth icon="box-archive" />
                {'Paperwork'}
              </Link>
            </td>
          </tr>
          {
            Boolean(rescueRats.length) && (
              <>
                <tr className={styles.separator}>
                  <td />
                  <td className={styles.infoValue} />
                </tr>
                {rescueRats.map((ratRow, index) => {
                  if (index !== 0 || !carrier) {
                    return ratRow
                  }
                  const [titleCell, valueCell] = ratRow.props.children
                  const newValueCell = cloneElement(valueCell, {
                    children: (
                      <span className={styles.carrierRatGroup}>
                        <CarrierIcon className={styles.carrierIcon} title="Fleet Carrier" />
                        {valueCell.props.children}
                      </span>
                    ),
                  })
                  return cloneElement(ratRow, { children: [titleCell, newValueCell] })
                })}
              </>
            )
          }
          {
            Boolean(quotes.length) && (
              <>
                <tr className={styles.separator}>
                  <td />
                  <td className={styles.infoValue} />
                </tr>
                {
                  quoteGroups.map((group, groupIdx) => {
                    const groupKey = `g-${group.items[0].originalIndex}`
                    const isCollapsible = group.isEvent && group.items.length >= 4
                    const isExpanded = expandedGroups.has(groupKey)
                    const hiddenCount = group.items.length - 2

                    const itemRows = group.items.map((item, idxInGroup) => {
                      if (isCollapsible && !isExpanded && idxInGroup !== 0 && idxInGroup !== group.items.length - 1) {
                        return null
                      }

                      const isFirstOverall = groupIdx === 0 && idxInGroup === 0

                      return (
                        <tr key={item.quote.createdAt}>
                          {
                            isFirstOverall
                              ? (<td className={styles.infoTitle}>{'Quotes'}</td>)
                              : (<td />)
                          }
                          <td className={clsx(styles.infoValue, styles.infoGroup, styles.quote, { [styles.event]: item.isEvent })}>
                            <span className={styles.quoteIndex}>
                              {item.originalIndex}
                            </span>
                            {!item.isEvent && (
                              <span className={styles.quoteAuthor}>
                                {`<${item.quoteSender}>`}
                              </span>
                            )}

                            <span className={styles.quoteMessage}>
                              {item.quoteMessage}
                            </span>

                            <span className={clsx(styles.quoteTime, { [styles.withVia]: item.isViaAuthor })}>
                              <span title={formatAsEliteDateTime(item.quote.createdAt)}>{formatQuoteTime(item.quote.createdAt)}</span>
                              {item.isViaAuthor && !item.isEvent && (<span className={styles.quoteAuthorVia}>{`via ${item.quote.lastAuthor ?? item.quote.author}`}</span>)}
                            </span>

                          </td>
                        </tr>
                      )
                    })

                    const toggleRow = isCollapsible && (
                      <tr key={`${groupKey}-toggle`}>
                        <td />
                        <td className={clsx(styles.infoValue, styles.infoGroup, styles.quote, styles.eventCollapse)}>
                          <button
                            className={styles.eventCollapseButton}
                            type="button"
                            onClick={() => {
                              return toggleGroup(groupKey)
                            }}>
                            <FontAwesomeIcon className={styles.eventCollapseIcon} icon={isExpanded ? 'chevron-up' : 'chevron-down'} />
                            <span className={styles.eventCollapseText}>
                              {isExpanded
                                ? `Hide ${hiddenCount} event${hiddenCount === 1 ? '' : 's'}`
                                : `Show ${hiddenCount} hidden event${hiddenCount === 1 ? '' : 's'}`}
                            </span>
                          </button>
                        </td>
                      </tr>
                    )

                    if (!isCollapsible) {
                      return <Fragment key={groupKey}>{itemRows}</Fragment>
                    }

                    if (isExpanded) {
                      return (
                        <Fragment key={groupKey}>
                          {itemRows}
                          {toggleRow}
                        </Fragment>
                      )
                    }

                    return (
                      <Fragment key={groupKey}>
                        {itemRows[0]}
                        {toggleRow}
                        {itemRows[itemRows.length - 1]}
                      </Fragment>
                    )
                  })
                }
              </>
            )
          }
        </tbody>
      </table>
    </div>
  )
}

RescueDetailsContent.propTypes = {
  rescue: PropTypes.object.isRequired,
}

export default RescueDetailsContent
