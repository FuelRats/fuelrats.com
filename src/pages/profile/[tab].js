import { HttpStatus } from '@fuelrats/web-util/http'
import Router from 'next/router'
import React from 'react'

import { authenticated } from '~/components/AppLayout'
import DeveloperPanel from '~/components/DeveloperPanel'
import FirstLoginModal from '~/components/FirstLoginModal'
import ProfileHeader from '~/components/ProfileHeader'
import TabbedPanel from '~/components/TabbedPanel'
import UserOverview from '~/components/UserOverview'
import UserRatsPanel from '~/components/UserRatsPanel'
import { setError } from '~/helpers/gIPTools'





@authenticated
class Profile extends React.Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleFLDClose = () => {
    Router.replace(`/profile/${this.props.query.tab}`)
  }

  _handleTabClick = (newTab) => {
    Router.replace(`/profile/${newTab}`)
  }

  _handlePermissionError = () => {
    Router.replace('/profile/overview')
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
            onPermissionError={this._handlePermissionError}
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
        render: () => {
          return (<UserOverview />)
        },
        title: 'Overview',
        pageTitle: 'Profile',
      },
      rats: {
        render: () => {
          return (<UserRatsPanel />)
        },
        title: 'Rats',
        pageTitle: 'Your Rats',
      },
      developer: {
        render: () => {
          return (<DeveloperPanel />)
        },
        title: 'Developer',
        pageTitle: 'Developer',
        permission: 'developer.write',
      },
    }
  }
}





export default Profile
