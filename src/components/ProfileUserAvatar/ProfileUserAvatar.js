import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { isError } from 'flux-standard-action'
import PropTypes from 'prop-types'
import { useState, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'


import { deleteAvatar, getUserProfile } from '~/store/actions/user'
import { selectUserById, withCurrentUserId } from '~/store/selectors'

import UploadAvatarModal from '../UploadAvatarModal'
import UserAvatar from '../UserAvatar'
import styles from './ProfileUserAvatar.module.scss'


const faIconLgSize = 100
const faIconMdSize = 64

function ProfileUserAvatar ({
  canEdit,
  size = 170,
}) {
  const user = useSelector(withCurrentUserId(selectUserById))
  const hasCustomAvatar = Boolean(user?.relationships?.avatar?.data)
  const dispatch = useDispatch()

  const [showUploadAvatar, setShowUploadAvatar] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleToggleUploadAvatar = useCallback(() => {
    setShowUploadAvatar((prevState) => {
      return !prevState
    })
  }, [])

  const handleAvatarModalClose = useCallback(() => {
    return setShowUploadAvatar(false)
  }, [])

  const handleDeleteAvatar = useCallback(async () => {
    // eslint-disable-next-line no-alert -- intentional confirmation
    if (!window.confirm('Are you sure you want to remove your avatar?')) {
      return
    }
    setDeleting(true)
    const response = await dispatch(deleteAvatar())
    if (isError(response)) {
      // eslint-disable-next-line no-alert -- simple feedback for rare failure
      window.alert('Failed to remove avatar. Please try again.')
      setDeleting(false)
      return
    }
    // Best-effort refresh — avatar is already deleted, so failing here just
    // leaves stale profile data until next navigation.
    await dispatch(getUserProfile()).catch(() => {})
    setDeleting(false)
  }, [dispatch])

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
          <UserAvatar size={size} />
          {
            canEdit && (
              <button
                aria-label="Edit your avatar"
                className={clsx(styles.userAvatarEdit, styles.editFace)}
                type="button"
                onClick={handleToggleUploadAvatar}>
                <FontAwesomeIcon icon="upload" size={sizeMeta.icon} />
              </button>
            )
          }
        </div>
        {
          canEdit && hasCustomAvatar && (
            <button
              aria-label="Remove your avatar"
              className={styles.deleteButton}
              disabled={deleting}
              type="button"
              onClick={handleDeleteAvatar}>
              <FontAwesomeIcon icon="trash" />
            </button>
          )
        }
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
