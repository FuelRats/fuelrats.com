// Module imports
import React from 'react'





// Component import
import { Link } from '../routes'





const AdminUserMenuNav = () => (
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





export default AdminUserMenuNav
