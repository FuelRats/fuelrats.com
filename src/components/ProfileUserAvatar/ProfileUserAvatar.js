import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import PropTypes from 'prop-types'
import { useState, useCallback, useMemo } from 'react'

import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import { selectAvatarUrlByUserId, withCurrentUserId } from '~/store/selectors'

import UploadAvatarModal from '../UploadAvatarModal'
import styles from './ProfileUserAvatar.module.scss'

const faIconLgSize = 100
const faIconMdSize = 64

function ProfileUserAvatar ({
  canEdit,
  size = 170,
}) {
  const userAvatarUrl = useSelectorWithProps({ size }, withCurrentUserId(selectAvatarUrlByUserId))

  const [showUploadAvatar, setShowUploadAvatar] = useState(false)

  const handleToggleUploadAvatar = useCallback(() => {
    setShowUploadAvatar((prevState) => {
      return !prevState
    })
  }, [])

  const handleAvatarModalClose = useCallback(() => {
    return setShowUploadAvatar(false)
  }, [])

  const sizeMeta = useMemo(() => {
    let icon = undefined

    if (size >= faIconLgSize) {
      icon = '3x'
    } else if (size >= faIconMdSize) {
      icon = '2x'
    }

    return {
      style: {
        width: `${size}px`,
        height: `${size}px`,
      },
      icon,
    }
  }, [size])

  return (
    <>
      <div className={styles.userAvatar}>
        <div className="avatar" style={sizeMeta.style}>
          <Image
            unoptimized
            alt="User's avatar"
            height={size}
            src={userAvatarUrl}
            width={size} />
          {
            canEdit && (
              <button
                aria-label="Edit your avatar"
                className={[styles.userAvatarEdit, styles.editFace]}
                type="button"
                onClick={handleToggleUploadAvatar}>
                <FontAwesomeIcon icon="upload" size={sizeMeta.icon} />
              </button>
            )
          }
        </div>
      </div>
      <UploadAvatarModal
        isOpen={showUploadAvatar}
        onClose={handleAvatarModalClose} />
    </>
  )
}

ProfileUserAvatar.propTypes = {
  canEdit: PropTypes.bool,
  size: PropTypes.number,
}

export default ProfileUserAvatar
