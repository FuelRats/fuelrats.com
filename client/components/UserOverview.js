// Module imports
import React from 'react'





// Component imports
import UserDecalPanel from './UserDecalPanel'
import UserDetailsPanel from './UserDetailsPanel'
import UserNicknamesPanel from './UserNicknamesPanel'





const UserOverview = () => (
  <div className="user-overview-tab">
    <UserDetailsPanel />

    <UserNicknamesPanel />

    <UserDecalPanel />
  </div>
)




export default UserOverview
