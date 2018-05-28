// Module imports
import React from 'react'





// Component imports
import PageWrapper from '../components/PageWrapper'
import TabbedPanel from '../components/TabbedPanel'
import UserOverview from '../components/UserOverview'
import UserRatsPanel from '../components/UserRatsPanel'
import UserSettings from '../components/UserSettings'





class Profile extends React.Component {
  /***************************************************************************\
    Properties
  \***************************************************************************/

  static authenticationRequired = true





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    return (
      <PageWrapper title="Profile">
        <div className="page-content">
          <TabbedPanel
            name="User Tabs"
            tabs={Profile.tabs} />
        </div>
      </PageWrapper>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  static get tabs () {
    return [
      {
        default: true,
        component: (<UserOverview />),
        title: 'Overview',
      },
      {
        component: (<UserRatsPanel />),
        title: 'Rats',
      },
      // {
      //   component: (<UserStatsOverview />),
      //   title: 'Stats',
      // },
      // {
      //   component: (<div>Badge</div>),
      //   title: 'Badge',
      // },
      {
        component: (<UserSettings />),
        title: 'Settings',
      },
    ]
  }
}





export default Profile
