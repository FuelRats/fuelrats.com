import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector } from 'react-redux'
import { differenceInMinutes } from 'date-fns'

import CarrierIcon from '~/components/CarrierIcon'
import PlatformBadge from '~/components/PlatformBadge'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'

import {
  useQuoteString, useRescueLanguage, useRescuePlatform, useRescueSystem, useRescuePermit,
} from '~/hooks/rescueHooks'
import useStoreEffect from '~/hooks/useStoreEffect'
import { selectRescueById, createSelectRenderedRatList } from '~/store/selectors'
import makeRoute from '~/util/router/makeRoute'

import CopyToClipboard from '../CopyToClipboard'
import styles from './DispatchTable.module.scss'
import clsx from 'clsx'



// Component Constants
const selectRenderedRatList = createSelectRenderedRatList((rat, index, arr) => {
  const isLast = index === arr.length - 1
  const { name } = rat.attributes

  return (
    <CopyToClipboard key={rat.id} text={name}>
      {
        rat.type === 'unidentified-rats'
          ? (<i title="This rat is unidentified">{name}</i>)
          : name
        }
      {isLast ? '' : ', '}
    </CopyToClipboard>
  )
})



function RescueRow (props) {
  const rescue = useSelector((state) => {
    return selectRescueById(state, props)
  })
  const rescueRats = useSelector((state) => {
    return selectRenderedRatList(state, props)
  })

  const quoteString = useQuoteString(rescue)
  const rescueLanguage = useRescueLanguage(rescue)
  const rescuePlatform = useRescuePlatform(rescue)
  const rescueSystem = useRescueSystem(rescue)
  const rescuePermit = useRescuePermit(rescue)

  // Flash any rescue under a minute old on mount. This flashes all new rescues when they are created, and any immediately new ones on page load.
  const [animating, setAnimating] = useState(differenceInMinutes(Date.now(), new Date(rescue.attributes.createdAt)) < 1)

  const handleTransitionEnd = useCallback(() => {
    setAnimating(false)
  }, [])

  const router = useRouter()
  useStoreEffect(
    (nextState) => {
      if (nextState.attributes.status === 'closed') {
        if (router.query.rId === nextState.id) {
          router.push('/dispatch')
        }
      } else {
        setAnimating(true)
      }
    },
    [router],
    `rescues.${rescue.id}`,
  )

  const handleFocusRescue = useCallback(() => {
    const query = {}

    if (router.query.rId !== rescue.id) {
      query.rId = rescue.id
    }

    router.push(makeRoute('/dispatch', query))
  }, [rescue.id, router])

  const {
    carrier,
    codeRed,
    status,
    client,
    commandIdentifier,
    expansion,
    platform,
  } = rescue.attributes

  const radioInputId = `rdetail-${rescue.id}`
  const isSelected = router.query.rId === rescue.id

  return (
    <tr
      className={
        clsx({
          [styles.codeRed]: codeRed,
          [styles.inactive]: status === 'inactive',
          [styles.selected]: isSelected,
          'animate-flash': animating,
        })
      }
      data-rescue-id={rescue.id}
      title={quoteString}
      onAnimationEnd={handleTransitionEnd}>
      <CopyToClipboard
        as="td"
        className={clsx(styles.rescueIdCell, { [styles.rescueIdCellCr]: codeRed })}
        text={commandIdentifier ?? '?'}>
        {commandIdentifier ?? '?'}
      </CopyToClipboard>
      <td className={styles.cmdrCell}>
        <CopyToClipboard
          doHint
          className={styles.cmdrNameCol}
          text={client ?? ''}
          title={client ?? ''}>
          <span className={styles.cmdrName}>
            {client ?? '?'}
          </span>
        </CopyToClipboard>
      </td>
      <td
        className={clsx('rescue-row-platform', styles.platformCell)}
        title={rescuePlatform.long}>
        <PlatformBadge expansion={expansion} platform={platform} />
      </td>
      <td
        className={clsx('rescue-row-language', styles.languageCell)}
        title={rescueLanguage.region ? `${rescueLanguage.long} (${rescueLanguage.region})` : rescueLanguage.long}>
        {rescueLanguage.short}
        {rescueLanguage.flag && (
          <span className={styles.languageFlag}>{rescueLanguage.flag}</span>
        )}
      </td>
      <CopyToClipboard
        doHint
        as="td"
        className={styles.systemCell}
        text={rescue.attributes.system ?? 'Unknown'}>
        {rescueSystem ?? 'N/A'}
        {
          rescuePermit && (
            <span aria-label={rescuePermit} className={styles.rescueRowPermit} role="img" title={rescuePermit}>
              <FontAwesomeIcon fixedWidth icon="lock" />
            </span>
          )
        }
      </CopyToClipboard>
      <td className={clsx('rescue-row-rats', styles.ratsCell)}>
        {carrier && (<CarrierIcon className={styles.carrierIcon} title="Fleet Carrier" />)}
        {rescueRats}
      </td>
      <td className={styles.rescueRowFocus}>
        <label className={clsx('button icon', { active: router.query.rId === rescue.id })} htmlFor={radioInputId}>
          <input
            hidden
            readOnly
            aria-label={`Show detail view for rescue of ${client}`}
            checked={router.query.rId === rescue.id}
            id={radioInputId}
            name="detail"
            title="More details..."
            type="radio"
            value={rescue.id}
            onClick={handleFocusRescue} />
          <FontAwesomeIcon fixedWidth icon="ellipsis" />
        </label>
      </td>

    </tr>
  )
}

RescueRow.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  rescueId: PropTypes.string.isRequired,
}





export default RescueRow
