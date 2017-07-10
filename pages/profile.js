// Module imports
import React from 'react'





// Component imports
import Page from '../components/Page'
import UserNicknamesPanel from '../components/UserNicknamesPanel'
import UserDetailsPanel from '../components/UserDetailsPanel'
import UserRatsPanel from '../components/UserRatsPanel'
import UserShipsPanel from '../components/UserShipsPanel'
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

          <div className="user-entities-cell">
            <UserRatsPanel />

            <UserNicknamesPanel />

            <UserShipsPanel />
          </div>

          <div className="user-stats-cell">
            <UserStatsPanel />
          </div>
        </div>
      </Page>
    )
  }
//          <div className="row">
//            <UserDetailsPanel />
//          </div>
//
//          <div className="row">
//            <div className="column">
//              <div className="row">
//                <UserRatsPanel />
//              </div>
//
//              <div className="row">
//                <UserNicknamesPanel />
//              </div>
//            </div>
//
//            <UserStatsPanel />
//          </div>





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get title () {
    return 'Profile'
  }
}
