// Module imports
import React from 'react'





// Component imports
import { connect } from '../store'
import {
  selectSession,
  selectUser,
  selectUserAvatar,
  selectUserGroups,
  withCurrentUserId,
} from '../store/selectors'
import { Link } from '../routes'
import userHasPermission from '../helpers/userHasPermission'

const UserMenu = (props) => {
  const {
    showRescueList,
    showUserList,
  } = props

  const {
    authenticatedPage,
    loggedIn,
    logout,
    user,
    userAvatar,
    userId,
  } = props

  const renderNavItem = (item) => {
    const {
      action,
      className,
      key,
      route,
      routeParams,
      permission,
      title,
    } = item

    if (typeof (permission) === 'undefined' || permission) {
      return (
        <li className={className} key={key}>
          <Link route={route} params={routeParams}>
            <a {...(action && { href: '#', onClick: action })}>
              <span>{title}</span>
            </a>
          </Link>
        </li>
      )
    }

    return null
  }

  const renderNav = (nav) => {
    const {
      header,
      items,
    } = nav

    const permissions = items.map((item) => item.permission)
    const permitted = permissions.includes(true) || permissions.includes(undefined)

    if (permitted) {
      return (
        <nav>
          {permitted && (<header>{header}</header>)}
          <ul>
            {permitted && items.map(renderNavItem)}
          </ul>
        </nav>
      )
    }

    return null
  }

  const userItems = [
    {
      key: 'profile',
      title: 'Profile',
      route: 'profile',
    },
    {
      key: 'my-rats',
      title: 'My Rats',
      route: 'profile',
      routeParams: { tab: 'rats' },
    },
    {
      key: 'my-rescues',
      title: 'My Rescues',
      route: 'home',
    },
    {
      key: 'logout',
      title: 'Logout',
      route: 'home',
      action: () => logout(authenticatedPage),
      className: 'logout',
    },
  ]

  const adminItems = [
    {
      key: 'admin-rescues-list',
      title: 'Rescues',
      route: 'admin rescues list',
      permission: showRescueList,
    },
    {
      key: 'admin-users',
      title: 'Users',
      permission: showUserList,
    },
  ]

  return (
    <div className={`user-menu ${loggedIn ? 'logged-in' : ''} ${loggedIn && !userId ? 'logging-in' : ''}`}>
      {Boolean(loggedIn) && (
        <>
          <input
            aria-label="User menu toggle"
            id="UserMenuControl"
            type="checkbox" />

          <label className="avatar medium" htmlFor="UserMenuControl" id="UserMenuToggle">
            {Boolean(user) && (
              <img alt="Your avatar" src={userAvatar} />
            )}
          </label>
        </>
      )}

      {(loggedIn && user) && (
        <menu>
          {renderNav({ items: userItems })}
          {renderNav({ header: 'Admin', items: adminItems })}
        </menu>
      )}

      {!loggedIn && (
        <button
          className="login"
          onClick={() => props.setFlag('showLoginDialog', true)}
          type="button">
          Rat Login
        </button>
      )}
    </div>
  )
}





UserMenu.mapDispatchToProps = ['logout', 'setFlag']

UserMenu.mapStateToProps = (state) => ({
  ...selectSession(state),
  user: withCurrentUserId(selectUser)(state),
  userAvatar: withCurrentUserId(selectUserAvatar)(state),
  showRescueList: userHasPermission(withCurrentUserId(selectUserGroups)(state), 'rescue.write'),
  // showUserList: userHasPermission(withCurrentUserId(selectUserGroups)(state), 'user.write'),
  showUserList: false, // Until route exists
})





export default connect(UserMenu)
