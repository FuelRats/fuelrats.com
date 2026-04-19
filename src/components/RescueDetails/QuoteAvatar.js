import PropTypes from 'prop-types'

import useNicknameUserId from '~/hooks/useNicknameAvatar'

import UserAvatar from '../UserAvatar'
import styles from './RescueDetails.module.scss'


function QuoteAvatar ({ nick }) {
  const userId = useNicknameUserId(nick)

  return (
    <span className={styles.quoteAvatarSlot}>
      {
        userId && (
          <UserAvatar
            className={styles.quoteAvatar}
            size={64}
            userId={userId} />
        )
      }
    </span>
  )
}

QuoteAvatar.propTypes = {
  nick: PropTypes.string,
}


export default QuoteAvatar
