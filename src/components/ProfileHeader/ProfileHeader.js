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

import ProfileUserAvatar from '../ProfileUserAvatar'
import UnverifiedUserBanner from './UnverifiedUserBanner'





function ProfileHeader () {
  const groups = useSelector(withCurrentUserId(selectGroupsByUserId))
  const displayRat = useSelector(withCurrentUserId(selectDisplayRatByUserId))
  const userIsVerified = useSelectorWithProps({ scope: 'users.verified' }, selectCurrentUserHasScope)
  const { createdAt, email } = useSelector(withCurrentUserId(selectUserById))?.attributes ?? {}

  return (
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
    </div>
  )
}





export default ProfileHeader
