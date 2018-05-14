// Module imports
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'





// Component imports
import { actions } from '../store'
import AdminUserMenuNav from './AdminUserMenuNav'
import Component from './Component'
import { Link } from '../routes'




class UserMenu extends Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentWillReceiveProps (nextProps) {
    if (nextProps.loggedIn && !nextProps.user.attributes) {
      this.props.getUser()
    }
  }

  render () {
    const {
      loggedIn,
      loggingIn,
      logout,
      user,
    } = this.props

    let showAdmin = false

    if (loggedIn && user.attributes) {
      showAdmin = ['rat.read', 'rescue.read', 'user.read'].some(permission => user.permissions.has(permission))
    }

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
                    <a>My Profile</a>
                  </Link>
                </li>

                <li>
                  <Link href="/leaderboard">
                    <a>Leaderboard</a>
                  </Link>
                </li>

                <li>
                  <a
                    href="#"
                    onClick={logout}>
                    Logout
                  </a>
                </li>
              </ul>
            </nav>

            {showAdmin && (
              <AdminUserMenuNav
                permissions={user.permissions} />
            )}

            <div
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
            </div>
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

const mapStateToProps = ({ authentication, user }) => ({
  ...authentication,
  user,
})





export default connect(mapStateToProps, mapDispatchToProps)(UserMenu)
