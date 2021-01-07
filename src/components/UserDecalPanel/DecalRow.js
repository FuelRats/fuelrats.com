import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useReducer } from 'react'

import { formatAsEliteDate } from '~/helpers/formatTime'
import reduceToggle from '~/hooks/reducers/reduceToggle'





function DecalRow ({ decal }) {
  const [visible, handleVisibility] = useReducer(reduceToggle, false)

  if (!decal?.attributes.code) {
    return null
  }

  return (
    <div key={decal.id} className="decal">
      <div className="code">
        <button
          aria-label="Show decal code"
          className="icon toggle"
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
      <div className="claimed-at">{formatAsEliteDate(decal.attributes.claimedAt)}</div>
    </div>
  )
}





export default DecalRow
