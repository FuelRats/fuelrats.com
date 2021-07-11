import getConfig from 'next/config'
import Image from 'next/image'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { connect } from '~/store'
import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import { selectAvatarByUserId, withCurrentUserId } from '~/store/selectors'

import UploadAvatarModal from '../UploadAvatarModal'


function ProfileUserAvatar () {
  const userAvatar = useSelectorWithProps({ size: 170 }, withCurrentUserId(selectAvatarByUserId))

  const [ showUploadAvatar, setShowUploadAvatar ] = useState(false);

  const handleToggleUploadAvatar = () => {
    setShowUploadAvatar(!showUploadAvatar);
  }

  return (
    <>
      <div className="user-avatar" onClick={handleToggleUploadAvatar}>
        <div className="avatar xl">
          <Image
            unoptimized
            alt="User's avatar"
            height={170}
            src={ userAvatar }
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
        onClose={handleToggleUploadAvatar} />
    </>
  )
}

export default ProfileUserAvatar
