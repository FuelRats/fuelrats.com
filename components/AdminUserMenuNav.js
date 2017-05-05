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
            <a href="/rescues">Rescues</a>
          </li>

          <li>
            <a href="/rats">Rats</a>
          </li>

          <li>
            <a href="/users">Users</a>
          </li>
        </ul>
      </nav>
    )
  }
}
