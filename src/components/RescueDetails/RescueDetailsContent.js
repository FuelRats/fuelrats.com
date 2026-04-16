import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import PropTypes from 'prop-types'

import {
  useRescuePlatform, useRescueLanguage, useRescuePermit, useRescueLandmark, useRescueHasScoopableStar,
} from '~/hooks/rescueHooks'
import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import { createSelectRenderedRatList } from '~/store/selectors'
import formatAsEliteDateTime from '~/util/date/formatAsEliteDateTime'
import { expansionLongNameMap } from '~/util/expansion'
import makePaperworkRoute from '~/util/router/makePaperworkRoute'

import CopyToClipboard from '../CopyToClipboard'
import PlatformBadge from '../PlatformBadge'
import ElapsedTimer from '../ElapsedTimer'
import styles from './RescueDetails.module.scss'





const selectRenderedRatList = createSelectRenderedRatList((rat, index) => {
  const { name } = rat.attributes

  return (
    <tr key={rat.id}>
      {
        index === 0
          ? (<td className={styles.infoTitle}>{'Rats'}</td>)
          : (<td />)
      }
      <td className={[styles.infoValue, styles.infoGroup]}>
        {
          rat.type === 'unidentified-rats' && (
            <i title="This rat is unidentified">
              {`${name}*`}
            </i>
          )
        }
        {
          rat.type === 'rats' && (
            <span>{name}</span>
          )
        }
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
  } = rescue.attributes

  const rescueLanguage = useRescueLanguage(rescue)
  const rescuePlatform = useRescuePlatform(rescue)
  const rescueRats = useSelectorWithProps({ rescueId: rescue.id }, selectRenderedRatList)
  const rescuePermit = useRescuePermit(rescue)
  const rescueLandmark = useRescueLandmark(rescue)
  const rescueHasScoopableStar = useRescueHasScoopableStar(rescue)

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
                <td className={styles.infoValue}>
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
                      <span className={['badge', styles.expansionBadge, expansion]}>
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
              <Link className={['button', styles.paperworkButton]} href={makePaperworkRoute({ rescueId: rescue.id, edit: true })}>
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
                {rescueRats}
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
                  quotes.map((quote, index) => {
                    const [isViaAuthor, quoteSender, quoteMessage] = quote.message.match(/^<(.*)>\s(.*)/u)
                      ?? [false, quote.lastAuthor ?? quote.author, quote.message]

                    return (
                      <tr key={quote.createdAt}>
                        {
                          index === 0
                            ? (<td className={styles.infoTitle}>{'Quotes'}</td>)
                            : (<td />)
                        }
                        <td className={[styles.infoValue, styles.infoGroup, styles.quote]}>
                          <span className={styles.quoteIndex}>
                            {index}
                          </span>
                          <span className={styles.quoteAuthor}>
                            {`<${quoteSender}>`}
                          </span>

                          <span className={styles.quoteMessage}>
                            {quoteMessage}
                          </span>

                          <span className={[styles.quoteTime, { [styles.withVia]: isViaAuthor }]}>
                            <span>{`[${formatAsEliteDateTime(quote.createdAt)}]`}</span>
                            {isViaAuthor && (<span className={styles.quoteAuthorVia}>{`via ${quote.lastAuthor ?? quote.author}`}</span>)}
                          </span>

                        </td>
                      </tr>
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
