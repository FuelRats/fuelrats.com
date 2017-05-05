// Module imports
import React from 'react'





// Component imports
import Page from '../components/Page'
import UserNicknamesPanel from '../components/UserNicknamesPanel'
import UserRatsPanel from '../components/UserRatsPanel'
import UserStatsPanel from '../components/UserStatsPanel'

import i18next from '../components/i18next'





export default class extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    return (
      <Page title={this.title}>
        <header className="page-header">
          <h1>{i18next.t('pages.profile')}</h1>
        </header>
        
        <div className="page-content">
          <div className="row">
            <UserStatsPanel />
          </div>
        
          <div className="row">
            <UserRatsPanel />

            <UserNicknamesPanel />
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
