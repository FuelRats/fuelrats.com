// Module imports
import React from 'react'





// Component imports
import { connect } from '../store'
import {
  selectSession,
  selectUser,
  selectUserAvatar,
  withCurrentUserId,
} from '../store/selectors'
import { Link } from '../routes'
import AdminUserMenuNav from './AdminUserMenuNav'

const UserMenu = (props) => {
  const {
    authenticatedPage,
    loggedIn,
    logout,
    user,
    userAvatar,
    userId,
  } = props

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
          <nav className="user">
            <ul>
              <li>
                <Link route="profile">
                  <a><span>Profile</span></a>
                </Link>
              </li>

              <li>
                <Link route="profile" params={{ tab: 'rats' }}>
                  <a><span>My Rats</span></a>
                </Link>
              </li>

              <li>
                <Link href="/">
                  <a><span>My Rescues</span></a>
                </Link>
              </li>

              <li>
                <Link route="home">
                  <a
                    onClick={() => logout(authenticatedPage)}
                    href="#">
                    <span>Logout</span>
                  </a>
                </Link>
              </li>
            </ul>
          </nav>

          <AdminUserMenuNav />
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
})





export default connect(UserMenu)
