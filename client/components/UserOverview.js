// Module imports
import React from 'react'





// Component imports
import UserDecalPanel from './UserDecalPanel'
import UserNicknamesPanel from './UserNicknamesPanel'





const UserOverview = () => (
  <div className="user-overview-tab">
    <UserNicknamesPanel />

    <UserDecalPanel />
  </div>
)




export default UserOverview
