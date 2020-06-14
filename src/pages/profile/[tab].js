// Module imports
import { HttpStatus } from '@fuelrats/web-util/http'
import React from 'react'





// Component imports
import { authenticated } from '~/components/AppLayout'
import FirstLoginModal from '~/components/FirstLoginModal'
import ProfileHeader from '~/components/ProfileHeader'
import TabbedPanel from '~/components/TabbedPanel'
import UserOverview from '~/components/UserOverview'
import UserRatsPanel from '~/components/UserRatsPanel'
import { setError } from '~/helpers/gIPTools'
import { Router } from '~/routes'




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

  static getInitialProps (ctx) {
    if (!this.tabs[ctx.query.tab]) {
      setError(ctx, HttpStatus.NOT_FOUND)
    }
  }

  static getPageMeta (ctx) {
    return {
      title: 'Profile',
      displayTitle: this.tabs[ctx.query.tab].pageTitle,
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
      <>
        <div className="page-content">
          <ProfileHeader />
          <TabbedPanel
            activeTab={tab || 'overview'}
            name="User Tabs"
            tabs={Profile.tabs}
            onTabClick={this._handleTabClick} />
        </div>

        <FirstLoginModal
          isOpen={showFirstLoginDialog}
          onClose={this._handleFLDClose} />

      </>
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
        pageTitle: 'Profile',
      },
      rats: {
        component: (<UserRatsPanel />),
        title: 'Rats',
        pageTitle: 'Your Rats',
      },
    }
  }
}





export default Profile
