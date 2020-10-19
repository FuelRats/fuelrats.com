import { HttpStatus } from '@fuelrats/web-util/http'
import React from 'react'

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
    Private Methods
  \***************************************************************************/

  _handleFLDClose = () => {
    Router.replaceRoute('profile', { tab: this.props.query.tab })
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
      pageKey: 'profile',
    }
  }

  render () {
    const {
      tab,
      fl,
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
          isOpen={fl === '1'}
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
