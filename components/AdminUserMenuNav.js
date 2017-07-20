// Module imports
import Link from 'next/link'
import React from 'react'





export default class extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    let {
      permissions,
    } = this.props

    return (
      <nav className="admin">
        <header>Admin</header>

        <ul className="">
          {permissions.has('rescue.read') && (
            <li>
              <Link href="/admin/rescues">
                <a>Rescues</a>
              </Link>
            </li>
          )}

          {permissions.has('rat.read') && (
            <li>
              <Link href="/admin/rats">
                <a>Rats</a>
              </Link>
            </li>
          )}

          {permissions.has('user.read') && (
            <li>
              <Link href="/admin/users">
                <a>Users</a>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    )
  }
}
