import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import PropTypes from 'prop-types'

import usePushNotifications from '~/hooks/usePushNotifications'




function PushNotificationButton ({ className }) {
  const { supported, permission, subscribed, loading, toggle } = usePushNotifications()

  if (!supported) {
    return null
  }

  const denied = permission === 'denied'

  let title = 'Enable rescue notifications'
  if (denied) {
    title = 'Notifications blocked — check browser settings'
  } else if (subscribed) {
    title = 'Rescue notifications enabled — click to disable'
  } else if (loading) {
    title = 'Updating...'
  }

  return (
    <button
      className={clsx('compact', className)}
      disabled={loading || denied}
      title={title}
      type="button"
      onClick={toggle}>
      <FontAwesomeIcon fixedWidth icon={subscribed ? 'bell' : 'bell-slash'} />
    </button>
  )
}

PushNotificationButton.propTypes = {
  className: PropTypes.string,
}




export default PushNotificationButton
