import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { differenceInMinutes } from 'date-fns'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'

import { makeRoute } from '~/helpers/routeGen'
import { useQuoteString, useLanguageData, usePlatformData } from '~/hooks/rescueHooks'
import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import useStoreEffect from '~/hooks/useStoreEffect'
import { selectRescueById, createSelectRenderedRatList } from '~/store/selectors'

import CopyToClipboard from '../CopyToClipboard'
import styles from './DispatchTable.module.scss'



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
  const rescue = useSelectorWithProps(props, selectRescueById)
  const rescueRats = useSelectorWithProps(props, selectRenderedRatList)

  const quoteString = useQuoteString(rescue)
  const rescueLanguage = useLanguageData(rescue)
  const rescuePlatform = usePlatformData(rescue)

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
    codeRed,
    status,
    clientNick,
    client,
    commandIdentifier,
    system,
  } = rescue.attributes

  const radioInputId = `rdetail-${rescue.id}`

  return (
    <tr
      className={
        {
          [styles.codeRed]: codeRed,
          [styles.inactive]: status === 'inactive',
          'animate-flash': animating,
        }
      }
      title={quoteString}
      onAnimationEnd={handleTransitionEnd}>
      <CopyToClipboard
        as="td"
        text={commandIdentifier ?? '?'}>
        {commandIdentifier ?? '?'}
      </CopyToClipboard>
      <CopyToClipboard
        doHint
        as="td"
        text={clientNick ?? client}
        title={clientNick ?? ''}>
        {client ?? '?'}
      </CopyToClipboard>
      <td
        className="rescue-row-language"
        title={rescueLanguage.long}>
        {rescueLanguage.short}
      </td>
      <td
        className="rescue-row-platform"
        title={rescuePlatform.long}>
        {rescuePlatform.short}
      </td>
      <CopyToClipboard
        doHint
        as="td"
        text={system ?? 'Unknown'}>
        {system ?? 'N/A'}
      </CopyToClipboard>
      <td className="rescue-row-rats">
        {rescueRats}
      </td>
      <td className={styles.rescueRowFocus}>
        <label className={['button icon', { active: router.query.rId === rescue.id }]} htmlFor={radioInputId}>
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
          <FontAwesomeIcon fixedWidth icon="ellipsis-h" />
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
