import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useReducer } from 'react'

import { formatAsEliteDate } from '~/helpers/formatTime'
import reduceToggle from '~/hooks/reducers/reduceToggle'

import styles from './UserDecalPanel.module.scss'



function DecalRow ({ decal }) {
  const [visible, handleVisibility] = useReducer(reduceToggle, false)

  if (!decal?.attributes.code) {
    return null
  }

  return (
    <div key={decal.id} className={styles.decal}>
      <div className={styles.decalCode}>
        <button
          aria-label="Show decal code"
          className={['icon', styles.toggle]}
          name={decal.id}
          type="button"
          onClick={handleVisibility}>
          <FontAwesomeIcon fixedWidth icon={visible ? 'eye' : 'eye-slash'} />
        </button>
        {
          visible
            ? decal.attributes.code
            : `•••••-•••••-•••••-•••••-${decal.attributes.code.substring(24)}`
        }
      </div>
      <div className={styles.decalClaimedAt}>
        {formatAsEliteDate(decal.attributes.claimedAt)}
      </div>
    </div>
  )
}





export default DecalRow
