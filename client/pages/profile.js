// Module imports
import React from 'react'





// Component imports
import { authenticated } from '../components/AppLayout'
import { Router } from '../routes'
import PageWrapper from '../components/PageWrapper'
import TabbedPanel from '../components/TabbedPanel'
import UserOverview from '../components/UserOverview'
import UserRatsPanel from '../components/UserRatsPanel'
import UserSettings from '../components/UserSettings'
import FirstLoginDialog from '../components/FirstLoginDialog'




@authenticated
class Profile extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    activeTab: (this.props.query && this.props.query.tab) || 'overview',
    showFirstLoginDialog: this.props.query.fl === '1',
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  _handleFLDClose = () => {
    this.setState({ showFirstLoginDialog: false })
    Router.replaceRoute('profile')
  }

  _handleTabClick = (newTab) => {
    this.setState({ activeTab: newTab })
    Router.replaceRoute('profile', { tab: newTab }, { shallow: true })
  }



  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      activeTab,
      showFirstLoginDialog,
    } = this.state
    return (
      <PageWrapper title="Profile">
        <div className="page-content">
          <TabbedPanel
            name="User Tabs"
            activeTab={activeTab}
            onTabClick={this._handleTabClick}
            tabs={Profile.tabs} />
        </div>

        {showFirstLoginDialog && (<FirstLoginDialog onClose={this._handleFLDClose} />)}

      </PageWrapper>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  static get tabs () {
    return {
      overview: {
        component: (<UserOverview />),
        title: 'Overview',
      },
      rats: {
        component: (<UserRatsPanel />),
        title: 'Rats',
      },
      settings: {
        component: (<UserSettings />),
        title: 'Settings',
      },
    }
  }
}





export default Profile
