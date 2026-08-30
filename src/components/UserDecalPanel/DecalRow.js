import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { useReducer } from 'react'

import reduceToggle from '~/hooks/reducers/reduceToggle'
import formatAsEliteDate from '~/util/date/formatAsEliteDate'

import styles from './UserDecalPanel.module.scss'


const REVEALED_CODE_START = 24


function DecalRow ({ decal }) {
  const [visible, handleVisibility] = useReducer(reduceToggle, false)

  if (!decal?.attributes.code) {
    return null
  }

  return (
    <div key={decal.id} className={styles.decal}>
      <div className={styles.decalCode}>
        <button
          aria-label={visible ? 'Hide decal code' : 'Show decal code'}
          className={clsx('icon', styles.toggle)}
          name={decal.id}
          type="button"
          onClick={handleVisibility}>
          <FontAwesomeIcon fixedWidth icon={visible ? 'eye' : 'eye-slash'} />
        </button>
        {
          visible
            ? decal.attributes.code
            : `•••••-•••••-•••••-•••••-${decal.attributes.code.substring(REVEALED_CODE_START)}`
        }
      </div>
      <div className={styles.decalClaimedAt}>
        {formatAsEliteDate(decal.attributes.claimedAt)}
      </div>
    </div>
  )
}





export default DecalRow
