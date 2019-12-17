// Module imports
import React from 'react'





// Component imports
import { PageWrapper, authenticated } from '../../components/AppLayout'
import FirstLoginModal from '../../components/FirstLoginModal'
import ProfileHeader from '../../components/ProfileHeader'
import TabbedPanel from '../../components/TabbedPanel'
import UserOverview from '../../components/UserOverview'
import UserRatsPanel from '../../components/UserRatsPanel'
import { Router } from '../../routes'




@authenticated
class Profile extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    showFirstLoginDialog: this.props.query.fl === '1',

  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleFLDClose = () => {
    this.setState({ showFirstLoginDialog: false })
    Router.replaceRoute('profile', { tab: this.props.query.tab }, { shallow: true })
  }

  _handleTabClick = (newTab) => {
    Router.replaceRoute('profile', { tab: newTab })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static getInitialProps ({ res, query }) {
    if (!this.tabs[query.tab]) {
      res.statusCode = 404
    }
  }

  render () {
    const {
      showFirstLoginDialog,
    } = this.state
    const {
      tab,
    } = this.props.query

    return (
      <PageWrapper title="Profile">
        <div className="page-content">
          <ProfileHeader />
          <TabbedPanel
            name="User Tabs"
            activeTab={tab || 'overview'}
            onTabClick={this._handleTabClick}
            tabs={Profile.tabs} />
        </div>

        <FirstLoginModal
          isOpen={showFirstLoginDialog}
          onClose={this._handleFLDClose} />

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
    }
  }
}





export default Profile
