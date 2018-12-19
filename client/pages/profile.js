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
    showFirstLoginDialog: false,
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  _handleFLDClose = () => {
    this.setState({ showFirstLoginDialog: false })
    Router.replaceRoute('profile')
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    if (this.props.query.fl === '1') {
      this.setState({ showFirstLoginDialog: true })
    }
  }

  render () {
    return (
      <PageWrapper title="Profile">
        <div className="page-content">
          <TabbedPanel
            name="User Tabs"
            tabs={Profile.tabs} />
        </div>

        {this.state.showFirstLoginDialog && (<FirstLoginDialog onClose={this._handleFLDClose} />)}

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
