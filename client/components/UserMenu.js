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

const NavItem = ({ item }) => {
  const {
    action,
    className,
    route,
    routeParams,
    permission = true,
    title,
  } = item

  if (permission) {
    return (
      <li className={className}>
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

const Nav = (nav) => {
  const {
    header,
    items,
  } = nav

  const permitted = items.filter(({ permission = true }) => permission).length > 0

  if (permitted) {
    return (
      <nav>
        {permitted && header && (<header>{header}</header>)}
        <ul>
          {permitted && items.map((item) => (<NavItem key={item.key} item={item} />))}
        </ul>
      </nav>
    )
  }

  return null
}

const UserMenu = (props) => {
  const {
    showRescueList,
    showUserList,
    authenticatedPage,
    loggedIn,
    logout,
    user,
    userAvatar,
    userId,
  } = props

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

  const actions = [
    {
      key: 'logout',
      title: 'Logout',
      route: 'home',
      action: () => logout(authenticatedPage),
      className: 'logout',
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
          <Nav items={userItems} />
          <Nav header="Admin" items={adminItems} />
          <Nav items={actions} />
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
