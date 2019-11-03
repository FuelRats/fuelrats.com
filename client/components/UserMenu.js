// Module imports
import React from 'react'





// Component imports
import { connect } from '../store'
import {
  selectAuthentication,
  selectUser,
  selectUserAvatar,
  selectUserGroups,
  withCurrentUser,
} from '../store/selectors'
import { Link } from '../routes'
import AdminUserMenuNav from './AdminUserMenuNav'
import userHasPermission from '../helpers/userHasPermission'




const UserMenu = (props) => {
  const {
    loggedIn,
    loggingIn,
    logout,
    user,
    userAvatar,
    showAdmin,
  } = props

  return (
    <div className={`user-menu ${loggedIn ? 'logged-in' : ''} ${loggingIn ? 'logging-in' : ''}`}>
      {Boolean(loggedIn || loggingIn) && (
        <div className="avatar medium">
          {Boolean(!loggingIn && user) && (
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
                <a
                  href="#"
                  onClick={logout}>
                  <span>Logout</span>
                </a>
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

      {!loggedIn && !loggingIn && (
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
  ...selectAuthentication(state),
  user: withCurrentUser(selectUser)(state),
  userAvatar: withCurrentUser(selectUserAvatar)(state),
  showAdmin: userHasPermission(withCurrentUser(selectUserGroups)(state), 'isAdministrator'),
})





export default connect(UserMenu)
