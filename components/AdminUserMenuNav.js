// Module imports
import Link from 'next/link'
import React from 'react'





export default class extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    return (
      <nav className="admin">
        <header>Admin</header>

        <ul className="">
          <li>
            <Link href="/admin/rescues">
              <a>Rescues</a>
            </Link>
          </li>

          <li>
            <Link href="/admin/rats">
              <a>Rats</a>
            </Link>
          </li>

          <li>
            <Link href="/admin/users">
              <a>Users</a>
            </Link>
          </li>
        </ul>
      </nav>
    )
  }
}
