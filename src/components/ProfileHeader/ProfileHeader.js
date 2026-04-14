import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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

import styles from './ProfileHeader.module.scss'
import ProfileUserAvatar from '../ProfileUserAvatar'
import UnverifiedUserBanner from './UnverifiedUserBanner'





const groupConfig = {
  verified: { color: '#918f8f', icon: 'circle-check' },
  rat: { color: '#49c549', icon: 'graduation-cap' },
  dispatch: { color: '#1e711e', icon: 'headset' },
  overseer: { color: '#df8122', icon: 'eye' },
  moderator: { color: '#d15656', icon: 'gavel' },
  trainer: { color: '#ffb366', icon: 'chalkboard-user' },
  techrat: { color: '#5d93b9', icon: 'gears' },
  netadmin: { color: '#276a99', icon: 'gears' },
  admin: { color: '#aa2020', icon: 'gavel' },
  owner: { color: '#89308c', icon: 'snowflake' },
  developer: { color: '#92b1c7', icon: 'code' },
  operations: { color: '#bb88ff', icon: 'clipboard-list' },
  merchant: { color: '#b883ba', icon: 'bag-shopping' },
}

function ProfileHeader () {
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
            {displayRat?.attributes?.name ?? email?.split('@')[0]}
          </div>
          <div className="email">
            <span className="label">{'E-Mail: '}</span>
            <span>{email}</span>
          </div>
          <div className="member-since">
            <span className="label">{'Date joined: '}</span>
            <span>{createdAt ? formatAsEliteDateTime(createdAt) : ''}</span>
          </div>
        </div>
        <div className="profile-user-badges">
          <ul>
            {
              groups?.map((group) => {
                const config = groupConfig[group.attributes.name]
                return (
                  <li
                    key={group.id}
                    className={[styles.groupBadge, group.attributes.name]}
                    style={config ? { backgroundColor: config.color } : undefined}>
                    {config?.icon && (<FontAwesomeIcon fixedWidth icon={config.icon} />)}
                    {group.attributes.displayName ?? group.attributes.name}
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    </>
  )
}





export default ProfileHeader
