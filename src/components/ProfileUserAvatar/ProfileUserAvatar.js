import getConfig from 'next/config'
import Image from 'next/image'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { formatAsEliteDateTime } from '~/helpers/formatTime'
import { connect } from '~/store'
import {
  selectGroupsByUserId,
  selectUserById,
  selectDisplayRatByUserId,
  selectAvatarByUserId,
  withCurrentUserId,
  selectCurrentUserHasScope,
} from '~/store/selectors'

import UploadAvatarModal from '../UploadAvatarModal'

const { publicRuntimeConfig } = getConfig()
const { appUrl } = publicRuntimeConfig

@connect
class ProfileHeader extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    showUploadAvatar: false
  }

  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleToggleUploadAvatar = () => {
    this.setState((state) => {
      return { showUploadAvatar: !state.showUploadAvatar }
    })
  }


  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      showUploadAvatar
    } = this.state
    const {
      userAvatar,
    } = this.props


    return (
      <>
        <div className="user-avatar" onClick={this._handleToggleUploadAvatar}>
          <div className="avatar xl">
            <Image
              unoptimized
              alt="User's avatar"
              height={170}
              src={`${appUrl}${userAvatar}`}
              width={170} />
          </div>
          <div className="edit-border user-avatar-edit">
            <div className="user-avatar-edit edit-back">
            </div>
            <div className="user-avatar-edit edit-face">
              <FontAwesomeIcon icon="upload" size="3x" />
            </div>
          </div>
        </div>
        <UploadAvatarModal
          isOpen={showUploadAvatar}
          onClose={this._handleToggleUploadAvatar} />
      </>
    )
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapStateToProps = (state) => {
    return {
      userAvatar: withCurrentUserId(selectAvatarByUserId)(state, { size: 170 })
    }
  }
}





export default ProfileHeader
