// Module imports
import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



// Component imports
import { connect } from '../../store'
import { selectRatById, selectUser } from '../../store/selectors'





// Component Constants





@connect
class ClassName extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {}





  /***************************************************************************\
    Private Methods
  \***************************************************************************/





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    return (
      <button
        className="inline white display-rat-button"
        type="button"
        disabled={this.canBeDefaultRat}
        title="Use this rat to represent you. (Display Rat)"
        onClick={this._handleSetDisplayRat}>
        <FontAwesomeIcon icon="id-card-alt" size="lg" fixedWidth />
      </button>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get canBeDefaultRat () {
    const {
      user,
      ratId,
    } = this.props

    return user.attributes.displayRatId !== ratId
  }



  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = []

  static mapStateToProps = (state, ownProps) => ({
    user: selectUser(state),
    rat: selectRatById(state, ownProps),
  })





  /***************************************************************************\
    Prop Definitions
  \***************************************************************************/

  static defaultProps = {}

  static propTypes = {
    ratId: PropTypes.string.isRequired,
  }
}





export default ClassName
