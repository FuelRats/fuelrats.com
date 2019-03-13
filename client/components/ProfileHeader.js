// Module imports
import React from 'react'
import moment from 'moment'
// import PropTypes from 'prop-types'




// Component imports
import { connect } from '../store'
import getDisplayRat from '../helpers/getDisplayRat'





// Component Constants
const ELITE_GAME_YEAR_DESPARITY = 1286 // Years between IRL year and Elite universe year





@connect
class ClassName extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {}





  /***************************************************************************\
    Private Methods
  \***************************************************************************/
  _renderUserGroups = () => this.props.user.relationships.groups.data.map((item) => <li className={`badge ${item.id}`} key={item.id}>{item.id}</li>)




  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const { displayRat } = this.props
    let { attributes } = this.props.user

    attributes = attributes || {}

    const {
      createdAt,
      email,
      image,
    } = attributes

    // console.log(this.props.user)
    return (
      <div className="profile-header">
        <div className="profile-user-avatar">
          <div className="avatar large"><img alt="User's avatar" src={image} /></div>
        </div>
        <div className="profile-rat-display">
          <span>
            {displayRat.attributes.name}
          </span>
        </div>
        <div className="profile-basic-info">
          <div className="profile-email-display">
            <span>
              {email}
            </span>
          </div>
          <div className="profile-member-since">
            <span>{moment(createdAt).add(ELITE_GAME_YEAR_DESPARITY, 'years').format('DD MMMM, YYYY')}</span>
          </div>
        </div>
        <div className="profile-user-badges">
          <ul>
            {this._renderUserGroups()}
          </ul>
        </div>
      </div>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['getUser']

  static mapStateToProps = (state) => ({
    user: state.user,
    displayRat: getDisplayRat(state.user, state.rats.rats),
  })
}





export default ClassName
