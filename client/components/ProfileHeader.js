// Module imports
import React from 'react'

// Component imports
import { connect } from '../store'
import { formatAsEliteDateLong } from '../helpers/formatTime'
import {
  selectUser,
  selectUserDisplayRat,
  selectUserAvatar,
  withCurrentUserId,
} from '../store/selectors'


@connect
class ClassName extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {}





  /***************************************************************************\
    Private Methods
  \***************************************************************************/
  _renderUserGroups = () => (
    this.props.user.relationships.groups.data && (
      this.props.user.relationships.groups.data.map((item) => (
        <li className={`badge ${item.id}`} key={item.id}>
          {item.id}
        </li>
      ))))





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      displayRat,
      userAvatar,
    } = this.props

    const attributes = this.props.user.attributes || {}

    const {
      createdAt,
      email,
    } = attributes

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
    Redux Properties
  \***************************************************************************/

  static mapStateToProps = (state) => ({
    user: withCurrentUserId(selectUser)(state),
    userAvatar: withCurrentUserId(selectUserAvatar)(state),
    displayRat: withCurrentUserId(selectUserDisplayRat)(state),
  })
}





export default ClassName
