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
import AdminUserMenuNav from './AdminUserMenuNav'
import userHasPermission from '../helpers/userHasPermission'

const UserMenu = (props) => {
  const {
    authenticatedPage,
    loggedIn,
    logout,
    user,
    userAvatar,
    userId,
    showAdmin,
  } = props

  return (
    <div className={`user-menu ${loggedIn ? 'logged-in' : ''} ${loggedIn && !userId ? 'logging-in' : ''}`}>
      {Boolean(loggedIn) && (
        <div className="avatar medium">
          {Boolean(user) && (
            <img alt="Your avatar" src={userAvatar} />
          )}
        </div>
      )}

      {(loggedIn && user) && (
        <menu>
          <nav className="user">
            <ul>
              <li>
                <Link route="profile">
                  <a><span>My Profile</span></a>
                </Link>
              </li>

              <li>
                <Link route="stats leaderboard">
                  <a><span>Leaderboard</span></a>
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

          {showAdmin && (
            <AdminUserMenuNav />
          )}

          {/* <div
            className="stats"
            hidden>
            <header>My Stats</header>

            <table>
              <tbody>
                <tr>
                  <th>Rescues</th>
                  <td>648</td>
                </tr>
                <tr>
                  <th>Assists</th>
                  <td>537</td>
                </tr>
                <tr>
                  <th>Favorite Ship</th>
                  <td>Asp Explorer</td>
                </tr>
              </tbody>
            </table>
          </div> */}
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
  showAdmin: userHasPermission(withCurrentUserId(selectUserGroups)(state), 'isAdministrator'),
})





export default connect(UserMenu)
