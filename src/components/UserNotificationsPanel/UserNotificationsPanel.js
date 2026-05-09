import EmailNotificationsPanel from '~/components/UserSecurityPanel/EmailNotificationsPanel'
import PushSubscriptionsPanel from '~/components/UserSecurityPanel/PushSubscriptionsPanel'


function UserNotificationsPanel () {
  return (
    <div>
      <EmailNotificationsPanel />
      <PushSubscriptionsPanel />
    </div>
  )
}


export default UserNotificationsPanel
