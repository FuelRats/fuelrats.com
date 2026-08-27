import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { differenceInMinutes } from 'date-fns'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import CarrierIcon from '~/components/CarrierIcon'
import PlatformBadge from '~/components/PlatformBadge'
import {
  useQuoteString, useRescueLanguage, useRescuePlatform, useRescueSystem, useRescuePermit,
} from '~/hooks/rescueHooks'
import { selectRescueById, createSelectRenderedRatList } from '~/store/selectors'
import makeRoute from '~/util/router/makeRoute'

import CopyToClipboard from '../CopyToClipboard'
import RatName from '../RatName'
import styles from './DispatchTable.module.scss'




// Component Constants
const selectRenderedRatList = createSelectRenderedRatList((rat, index, arr) => {
  const isLast = index === arr.length - 1
  const { name } = rat.attributes

  return (
    <CopyToClipboard key={rat.id} text={name}>
      <RatName rat={rat} size={18} />
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

  const { flashing, onFlashEnd } = props
  const createdAt = rescue?.attributes?.createdAt
  const isNew = Boolean(createdAt) && differenceInMinutes(Date.now(), new Date(createdAt)) < 1
  const [animating, setAnimating] = useState(isNew)
  const [newest, setNewest] = useState(isNew)

  useEffect(() => {
    if (flashing) {
      setAnimating(true)
    }
  }, [flashing])

  useEffect(() => {
    if (!newest) {
      return undefined
    }
    const ageMs = Date.now() - new Date(createdAt).getTime()
    const NEWEST_DURATION_MS = 60000
    const remaining = NEWEST_DURATION_MS - ageMs
    if (remaining <= 0) {
      setNewest(false)
      return undefined
    }
    const timer = setTimeout(() => {
      setNewest(false)
    }, remaining)
    return () => {
      return clearTimeout(timer)
    }
  }, [newest, createdAt])

  const handleAnimationEnd = useCallback(() => {
    setAnimating(false)
    if (onFlashEnd) {
      onFlashEnd(rescue.id)
    }
  }, [onFlashEnd, rescue.id])

  const router = useRouter()

  const handleFocusRescue = useCallback(() => {
    const query = {}

    if (router.query.rId !== rescue.id) {
      query.rId = rescue.id
    }

    router.push(makeRoute('/dispatch', query))
  }, [rescue?.id, router])

  if (!rescue) {
    return null
  }

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
          [styles.newest]: newest,
          'animate-flash': animating,
        })
      }
      data-rescue-id={rescue.id}
      title={quoteString}
      onAnimationEnd={handleAnimationEnd}>
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
        {
          rescueLanguage.flag && (
            <span className={styles.languageFlag}>{rescueLanguage.flag}</span>
          )
        }
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
  flashing: PropTypes.bool,
  onFlashEnd: PropTypes.func,
  // eslint-disable-next-line react/no-unused-prop-types
  rescueId: PropTypes.string.isRequired,
}





export default RescueRow
