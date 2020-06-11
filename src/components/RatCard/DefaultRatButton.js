// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import React from 'react'





// Component imports
import { connect } from '~/store'
import {
  selectCurrentUserId,
  selectDisplayRatIdByUserId,
  withCurrentUserId,
} from '~/store/selectors'




// TODO Check Usage of onUpdate
@connect
class DefaultRatButton extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {}





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleClick = async (event) => {
    const {
      updateUser,
      userId,
      ratId,
      onClick,
      onUpdate,
    } = this.props

    if (onClick) {
      await onClick(event)
    }

    const response = await updateUser(userId, { displayRatId: ratId })

    if (onUpdate) {
      onUpdate(response)
    }
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      isDefaultRat,
    } = this
    return (
      <button
        className="inline display-rat-button"
        disabled={isDefaultRat}
        title={isDefaultRat ? 'This rat represents you.' : 'Use this rat to represent you. (Display Rat)'}
        type="button"
        onClick={this._handleClick}>
        <FontAwesomeIcon fixedWidth icon="id-card-alt" size="lg" />
      </button>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get isDefaultRat () {
    const {
      displayRatId,
      ratId,
    } = this.props

    return displayRatId === ratId
  }



  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['updateUser']

  static mapStateToProps = (state) => {
    return {
      userId: selectCurrentUserId(state),
      displayRatId: withCurrentUserId(selectDisplayRatIdByUserId)(state),
    }
  }





  /***************************************************************************\
    Prop Definitions
  \***************************************************************************/

  static defaultProps = {}

  static propTypes = {
    ratId: PropTypes.string.isRequired,
  }
}





export default DefaultRatButton
