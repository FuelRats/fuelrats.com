// Module imports
import React from 'react'





// Component imports
import { connect } from '../store'
import { Link } from '../routes'
import AdminUserMenuNav from './AdminUserMenuNav'
import userHasPermission from '../helpers/userHasPermission'




const UserMenu = (props) => {
  const {
    loggedIn,
    loggingIn,
    logout,
    user,
    showAdmin,
  } = props

  return (
    <div className={`user-menu ${loggedIn ? 'logged-in' : ''} ${loggingIn ? 'logging-in' : ''}`}>
      {Boolean(loggedIn || loggingIn) && (
        <div className="avatar medium">
          {Boolean(!loggingIn && user.attributes) && (
            <img alt="Your avatar" src={user.attributes.image} />
          )}
        </div>
      )}

      {(loggedIn && user.attributes) && (
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

UserMenu.mapStateToProps = ({ authentication, user, groups }) => {
  const userGroups = user.relationships ? user.relationships.groups.data.map((group) => groups[group.id]) : []

  return {
    ...authentication,
    user,
    showAdmin: user.relationships ? userHasPermission(userGroups, 'isAdministrator') : false,
  }
}





export default connect(UserMenu)
