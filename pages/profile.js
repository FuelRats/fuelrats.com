// Module imports
import React from 'react'





// Component imports
import Page from '../components/Page'
import UserNicknamesPanel from '../components/UserNicknamesPanel'
import UserDetailsPanel from '../components/UserDetailsPanel'
import UserRatsPanel from '../components/UserRatsPanel'
import UserStatsPanel from '../components/UserStatsPanel'





export default class extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    return (
      <Page title={this.title}>
        <header className="page-header">
          <h1>{this.title}</h1>
        </header>

        <div className="page-content">
          <div className="user-details-cell">
            <UserDetailsPanel />
          </div>

          <div className="user-details-cell">
            <UserRatsPanel />
          </div>

          <div className="user-entities-cell">
            <UserNicknamesPanel />
          </div>

          <div className="user-stats-cell">
            <UserStatsPanel />
          </div>
        </div>
      </Page>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get title () {
    return 'Profile'
  }
}
