// Module imports
import Link from 'next/link'
import React from 'react'





// Component imports
import AdminUserMenuNav from './AdminUserMenuNav'





export default class extends React.Component {

  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _checkLoggedInStatus () {
    return false
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps () {
    return {
      loggedIn: true
    }
  }

  render () {
    let adminUserMenuNav = null
    let isAdmin = true
    let loggedIn = true

    if (isAdmin) {
      adminUserMenuNav = <AdminUserMenuNav />
    }

    return (
      <div className="user-menu">
        {loggedIn && ( 
          <div className="avatar medium"><img src="{{avatar}}" /></div>
        )}

        {loggedIn && ( 
          <menu>
            <nav className="user">
              <ul>
                <li>
                  <a href="/profile">My Profile</a>
                </li>
  
                <li>
                  <a href="/leaderboard">Leaderboard</a>
                </li>
  
                <li>
                  <a href="/logout">Logout</a>
                </li>
              </ul>
            </nav>
  
            {adminUserMenuNav}
  
            <div className="stats">
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
        
        {!loggedIn && ( 
          <button className="login">Login</button>
        )}
      </div>
    )
  }
}
