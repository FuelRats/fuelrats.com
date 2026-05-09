import { HttpStatus } from '@fuelrats/web-util/http'
import Router from 'next/router'
import { useCallback } from 'react'

import { authenticated } from '~/components/AppLayout'
import DeveloperPanel from '~/components/DeveloperPanel'
import FirstLoginModal from '~/components/FirstLoginModal'
import ProfileHeader from '~/components/ProfileHeader'
import TabbedPanel from '~/components/TabbedPanel'
import UserOverview from '~/components/UserOverview'
import UserRatsPanel from '~/components/UserRatsPanel'
import UserRescuesPanel from '~/components/UserRescuesPanel'
import UserNotificationsPanel from '~/components/UserNotificationsPanel/UserNotificationsPanel'
import UserSecurityPanel from '~/components/UserSecurityPanel/UserSecurityPanel'
import setError from '~/util/getInitialProps/setError'




const tabs = {
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
  rescues: {
    render: () => {
      return (<UserRescuesPanel />)
    },
    title: 'Rescues',
    pageTitle: 'Your Rescues',
  },
  notifications: {
    render: () => {
      return (<UserNotificationsPanel />)
    },
    title: 'Notifications',
    pageTitle: 'Notifications',
  },
  security: {
    render: () => {
      return (<UserSecurityPanel />)
    },
    title: 'Security',
    pageTitle: 'Security',
  },
  developer: {
    render: () => {
      return (<DeveloperPanel />)
    },
    title: 'Developer',
    pageTitle: 'Developer',
    permission: 'developer.read',
  },
}


function Profile ({ query }) {
  const { tab, fl } = query

  const handleFLDClose = useCallback(() => {
    Router.replace(`/profile/${tab}`)
  }, [tab])

  const handleTabClick = useCallback((newTab) => {
    Router.replace(`/profile/${newTab}`)
  }, [])

  const handlePermissionError = useCallback(() => {
    Router.replace('/profile/overview')
  }, [])

  return (
    <>
      <div className="page-content">
        <ProfileHeader />
        <TabbedPanel
          activeTab={tab || 'overview'}
          name="User Tabs"
          tabs={tabs}
          onPermissionError={handlePermissionError}
          onTabClick={handleTabClick} />
      </div>

      <FirstLoginModal
        isOpen={fl === '1'}
        onClose={handleFLDClose} />
    </>
  )
}

Profile.getInitialProps = (ctx) => {
  if (!tabs[ctx.query.tab]) {
    setError(ctx, HttpStatus.NOT_FOUND)
  }
}

Profile.getPageMeta = (ctx) => {
  const { tab } = ctx.query
  return {
    title: 'Profile',
    displayTitle: tabs[tab].pageTitle,
    key: 'profile',
  }
}




export default authenticated(Profile)
