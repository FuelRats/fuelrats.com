// Module imports
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'





// Component imports
import { actions } from '../store'
import AdminUserMenuNav from './AdminUserMenuNav'
import Component from './Component'
import { Link } from '../routes'
import { userHasPermission } from '../helpers'




class UserMenu extends Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidUpdate () {
    if (this.props.loggedIn && !this.props.user.attributes) {
      this.props.getUser()
    }
  }

  render () {
    const {
      loggedIn,
      loggingIn,
      logout,
      user,
      showAdmin,
    } = this.props

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
                  <Link href="/profile">
                    <a><span>My Profile</span></a>
                  </Link>
                </li>

                <li>
                  <Link href="/leaderboard">
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

            {/*<div
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
            </div>*/}
          </menu>
        )}

        {!loggedIn && !loggingIn && (
          <button
            className="login"
            onClick={() => this.props.setFlag('showLoginDialog', true)}>
            Rat Login
          </button>
        )}
      </div>
    )
  }
}





const mapDispatchToProps = dispatch => bindActionCreators({
  getUser: actions.getUser,
  logout: actions.logout,
  setFlag: actions.setFlag,
}, dispatch)

const mapStateToProps = ({ authentication, user, groups }) => {
  const userGroups = user.relationships ? user.relationships.groups.data.map(group => groups[group.id]) : []

  return {
    ...authentication,
    user,
    showAdmin: user.relationships ? userHasPermission(userGroups, 'isAdministrator') : false,
  }
}





export default connect(mapStateToProps, mapDispatchToProps)(UserMenu)
