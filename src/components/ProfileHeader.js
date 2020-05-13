// Module imports
import React from 'react'

// Component imports
import ChangePasswordModal from './ChangePasswordModal'
import DisableProfileModal from './DisableProfileModal'
import { formatAsEliteDateLong } from '~/helpers/formatTime'
import { connect } from '~/store'
import {
  selectUserById,
  selectDisplayRatByUserId,
  selectAvatarByUserId,
  withCurrentUserId,
} from '~/store/selectors'





@connect
class ProfileHeader extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    showChangePassword: false,
    showDisableProfile: false,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _renderUserGroups = () => {
    return (
      this.props.user.relationships.groups.data && (
        this.props.user.relationships.groups.data.map((item) => {
          return (
            <li key={item.id} className={['badge', item.id]}>
              {item.id}
            </li>
          )
        })))
  }

  _handleToggleChangePassword = () => {
    this.setState((state) => {
      return { showChangePassword: !state.showChangePassword }
    })
  }

  _handleToggleDisableProfile = () => {
    this.setState((state) => {
      return { showDisableProfile: !state.showDisableProfile }
    })
  }



  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      showChangePassword,
      showDisableProfile,
    } = this.state
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
      <>
        <div className="profile-header">
          <div className="user-avatar">
            <div className="avatar xl"><img alt="User's avatar" src={userAvatar} /></div>
          </div>
          <div className="profile-basic-info">
            <div className="rat-name">
              {displayRat.attributes.name}
            </div>
            <div className="email">
              <span className="label">{'E-Mail: '}</span>
              <span>{email}</span>
            </div>
            <div className="member-since">
              <span className="label">{'Date joined: '}</span>
              <span>{formatAsEliteDateLong(createdAt)}</span>
            </div>
          </div>
          <div className="profile-user-badges">
            <ul>
              {this._renderUserGroups()}
            </ul>
          </div>
          <div className="profile-controls">
            <button
              type="button"
              onClick={this._handleToggleChangePassword}>
              {'Change Password'}
            </button>
            <button
              type="button"
              onClick={this._handleToggleDisableProfile}>
              {'Disable Profile'}
            </button>
          </div>
        </div>
        <ChangePasswordModal
          isOpen={showChangePassword}
          onClose={this._handleToggleChangePassword} />
        <DisableProfileModal
          isOpen={showDisableProfile}
          onClose={this._handleToggleDisableProfile} />
      </>
    )
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapStateToProps = (state) => {
    return {
      user: withCurrentUserId(selectUserById)(state),
      userAvatar: withCurrentUserId(selectAvatarByUserId)(state),
      displayRat: withCurrentUserId(selectDisplayRatByUserId)(state),
    }
  }
}





export default ProfileHeader
