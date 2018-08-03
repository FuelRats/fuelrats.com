// Component imports
import UserDecalPanel from './UserDecalPanel'
import UserDetailsPanel from './UserDetailsPanel'
import UserNicknamesPanel from './UserNicknamesPanel'





export default () => (
  <div className="user-overview-tab">
    <UserDetailsPanel />

    <UserNicknamesPanel />

    <UserDecalPanel />
  </div>
)
