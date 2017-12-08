// Component imports
import UserDecalPanel from '../components/UserDecalPanel'
import UserDetailsPanel from '../components/UserDetailsPanel'
import UserNicknamesPanel from '../components/UserNicknamesPanel'





export default () => (
  <div className="user-overview-tab">
    <UserDetailsPanel />

    <UserNicknamesPanel />

    <UserDecalPanel />
  </div>
)
