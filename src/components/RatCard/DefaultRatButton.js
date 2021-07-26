import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { updateUser } from '~/store/actions/user'
import {
  selectCurrentUserId,
  selectDisplayRatIdByUserId,
  withCurrentUserId,
} from '~/store/selectors'





function DefaultRatButton (props) {
  const {
    ratId,
    onClick,
    onUpdate,
  } = props
  const dispatch = useDispatch()
  const userId = useSelector(selectCurrentUserId)
  const isDefaultRat = useSelector(withCurrentUserId(selectDisplayRatIdByUserId)) === ratId

  const handleClick = useCallback(async (event) => {
    await onClick?.(event)

    const response = await dispatch(updateUser({
      id: userId,
      attributes: {},
      relationships: {
        displayRat: {
          data: {
            type: 'rats',
            id: ratId,
          },
        },
      },
    }))

    if (onUpdate) {
      onUpdate(response)
    }
  }, [dispatch, onClick, onUpdate, ratId, userId])

  return (
    <button
      className="inline display-rat-button"
      disabled={isDefaultRat}
      title={isDefaultRat ? 'This rat represents you.' : 'Use this rat to represent you. (Display Rat)'}
      type="button"
      onClick={handleClick}>
      <FontAwesomeIcon fixedWidth icon="id-card-alt" size="lg" />
    </button>
  )
}

DefaultRatButton.propTypes = {
  onClick: PropTypes.func,
  onUpdate: PropTypes.func,
  ratId: PropTypes.string.isRequired,
}





export default DefaultRatButton
