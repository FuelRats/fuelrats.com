// Module imports
import React from 'react'





// Component imports
import Component from './Component'
import UserDecalPanel from '../components/UserDecalPanel'
import UserDetailsPanel from '../components/UserDetailsPanel'
import UserNicknamesPanel from '../components/UserNicknamesPanel'





export default class extends Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    return (
      <div className="user-overview-tab">
        <UserDetailsPanel />

        <UserNicknamesPanel />

        <UserDecalPanel />
      </div>
    )
  }
}
