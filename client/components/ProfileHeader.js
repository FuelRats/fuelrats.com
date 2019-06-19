// Module imports
import React from 'react'
// import PropTypes from 'prop-types'




// Component imports
import { connect } from '../store'
import { formatAsEliteDateLong } from '../helpers/formatTime'
import {
  selectUser,
  selectUserDisplayRat,
  selectUserAvatar,
} from '../store/selectors'




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
  _renderUserGroups = () => this.props.user.relationships.groups.data.map((item) => <li className={`badge ${item.id}`} key={item.id}>{item.id}</li>)




  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      displayRat,
      userAvatar,
    } = this.props

    let { attributes } = this.props.user

    attributes = attributes || {}

    const {
      createdAt,
      email,
    } = attributes

    // console.log(this.props.user)
    return (
      <div className="profile-header">
        <div className="user-avatar">
          <div className="avatar xl"><img alt="User's avatar" src={userAvatar} /></div>
        </div>
        <div className="profile-basic-info">
          <div className="rat-name">
            {displayRat.attributes.name}
          </div>
          <div className="email">
            <span className="label">E-Mail:</span> <span>{email}</span>
          </div>
          <div className="member-since">
            <span className="label">Date joined: </span> <span>{formatAsEliteDateLong(createdAt)}</span>
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
    user: selectUser(state),
    userAvatar: selectUserAvatar(state),
    displayRat: selectUserDisplayRat(state),
  })
}





export default ClassName
