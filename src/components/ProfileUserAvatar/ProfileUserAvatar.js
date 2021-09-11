import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import { useState, useCallback } from 'react'

import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import { selectAvatarUrlByUserId, withCurrentUserId } from '~/store/selectors'

import UploadAvatarModal from '../UploadAvatarModal'
import styles from './ProfileUserAvatar.module.scss'

function ProfileUserAvatar () {
  const userAvatarUrl = useSelectorWithProps({ size: 170 }, withCurrentUserId(selectAvatarUrlByUserId))

  const [showUploadAvatar, setShowUploadAvatar] = useState(false)

  const handleToggleUploadAvatar = useCallback(() => {
    setShowUploadAvatar((prevState) => {
      return !prevState
    })
  }, [])

  return (
    <>
      <div className={styles.userAvatar}>
        <div className="avatar xl">
          <Image
            unoptimized
            alt="User's avatar"
            height={170}
            src={userAvatarUrl}
            width={170} />
        </div>
        <div className={styles.userAvatarEdit}>
          <div className={[styles.userAvatarEdit, styles.editBack]} />
          <button className={[styles.userAvatarEdit, styles.editFace]} type="button" onClick={handleToggleUploadAvatar}>
            <FontAwesomeIcon icon="upload" size="3x" />
          </button>
        </div>
      </div>
      <UploadAvatarModal
        isOpen={showUploadAvatar}
        onClose={handleToggleUploadAvatar} />
    </>
  )
}

export default ProfileUserAvatar
