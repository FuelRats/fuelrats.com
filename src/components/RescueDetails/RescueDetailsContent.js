import PropTypes from 'prop-types'
import React from 'react'

import { formatAsEliteDateTime } from '~/helpers/formatTime'
import { usePlatformData, useLanguageData } from '~/hooks/rescueHooks'
import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import { Link } from '~/routes'
import { createSelectRenderedRatList } from '~/store/selectors'

import CopyToClipboard from '../CopyToClipboard'
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
    system,
    status,
    platform,
    clientLanguage,
    createdAt,
    title,
    quotes,
  } = rescue.attributes

  const rescueLanguage = useLanguageData(rescue)
  const rescuePlatform = usePlatformData(rescue)
  const rescueRats = useSelectorWithProps({ rescueId: rescue.id }, selectRenderedRatList)

  return (
    <div className={styles.rescueDetails}>
      <div className={styles.header}>
        <div className={styles.title}>
          {`${typeof commandIdentifier === 'number' ? `#${commandIdentifier} - ` : ''}${title ?? client}`}
          {codeRed && <span className="badge">{'CODE RED'}</span>}
          {status === 'inactive' && <span className="badge warn">{'Inactive'}</span>}
        </div>
        <div><ElapsedTimer from={createdAt} /></div>
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
                  <CopyToClipboard doHint text={system}>
                    {system}
                  </CopyToClipboard>
                </td>
              </tr>
            )
          }
          {
            platform && (
              <tr>
                <td className={styles.infoTitle}>{'Platform'}</td>
                <td className={styles.infoValue}>
                  {rescuePlatform.long}
                </td>
              </tr>
            )
          }
          {
            clientLanguage && (
              <tr>
                <td className={styles.infoTitle}>{'Language'}</td>
                <td className={styles.infoValue}>
                  {rescueLanguage.long}
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
              <Link params={{ rescueId: rescue.id }} route="paperwork edit">
                <a className="button icon">
                  {'paperwork'}
                </a>
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
