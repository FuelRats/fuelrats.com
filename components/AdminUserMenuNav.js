// Module imports
import Link from 'next/link'
import React from 'react'





export default (props) => (
  <nav className="admin">
    <header>Admin</header>

    <ul className="">
      {props.permissions.has('rescue.read') && (
        <li>
          <Link href="/admin/rescues">
            <a>Rescues</a>
          </Link>
        </li>
      )}

      {props.permissions.has('rat.read') && (
        <li>
          <Link href="/admin/rats">
            <a>Rats</a>
          </Link>
        </li>
      )}

      {props.permissions.has('user.read') && (
        <li>
          <Link href="/admin/users">
            <a>Users</a>
          </Link>
        </li>
      )}
    </ul>
  </nav>
)
