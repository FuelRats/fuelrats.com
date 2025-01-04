import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'

import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import {
  selectGroupsByUserId,
  selectUserById,
  selectDisplayRatByUserId,
  withCurrentUserId,
  selectCurrentUserHasScope,
} from '~/store/selectors'
import formatAsEliteDateTime from '~/util/date/formatAsEliteDateTime'

import ChangeEmailModal from '../ChangeEmailModal'
import ChangePasswordModal from '../ChangePasswordModal'
import DisableProfileModal from '../DisableProfileModal'
import ProfileUserAvatar from '../ProfileUserAvatar'
import UnverifiedUserBanner from './UnverifiedUserBanner'





function ProfileHeader () {
  const [showChangeEmail, setShowChangeEmail] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showDisableProfile, setShowDisableProfile] = useState(false)

  const handleToggleChangeEmail = useCallback(() => {
    setShowChangeEmail((state) => {
      return !state
    })
  }, [])

  const handleToggleChangePassword = useCallback(() => {
    setShowChangePassword((state) => {
      return !state
    })
  }, [])

  const handleToggleDisableProfile = useCallback(() => {
    setShowDisableProfile((state) => {
      return !state
    })
  }, [])

  const groups = useSelector(withCurrentUserId(selectGroupsByUserId))
  const displayRat = useSelector(withCurrentUserId(selectDisplayRatByUserId))
  const userIsVerified = useSelectorWithProps({ scope: 'users.verified' }, selectCurrentUserHasScope)
  const { createdAt, email } = useSelector(withCurrentUserId(selectUserById))?.attributes ?? {}

  return (
    <>
      <div className="profile-header">
        {
          !userIsVerified && (
            <UnverifiedUserBanner />
          )
        }
        <ProfileUserAvatar canEdit />
        <div className="profile-basic-info">
          <div className="rat-name">
            {displayRat?.attributes?.name ?? email.split('@')[0]}
          </div>
          <div className="email">
            <span className="label">{'E-Mail: '}</span>
            <span>{email}</span>
          </div>
          <div className="member-since">
            <span className="label">{'Date joined: '}</span>
            <span>{formatAsEliteDateTime(createdAt)}</span>
          </div>
        </div>
        <div className="profile-user-badges">
          <ul>
            {
              groups?.map((group) => {
                return (
                  <li key={group.id} className={['badge info', group.attributes.name]}>
                    {group.attributes.name}
                  </li>
                )
              })
            }
          </ul>
        </div>
        <div className="profile-controls">
          <button
            type="button"
            onClick={handleToggleChangeEmail}>
            {'Change E-Mail'}
          </button>
          <button
            type="button"
            onClick={handleToggleChangePassword}>
            {'Change Password'}
          </button>
          <button
            type="button"
            onClick={handleToggleDisableProfile}>
            {'Disable Profile'}
          </button>
        </div>
      </div>
      <ChangeEmailModal
        isOpen={showChangeEmail}
        onClose={handleToggleChangeEmail} />
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={handleToggleChangePassword} />
      <DisableProfileModal
        isOpen={showDisableProfile}
        onClose={handleToggleDisableProfile} />
    </>
  )
}





export default ProfileHeader
