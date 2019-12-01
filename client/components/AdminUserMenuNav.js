// Module imports
import React from 'react'





// Component import
import { connect } from '../store'
import {
  selectSession,
  selectUserGroups,
  withCurrentUserId,
} from '../store/selectors'
import { Link } from '../routes'
import userHasPermission from '../helpers/userHasPermission'




const AdminUserMenuNav = (props) => {
  const {
    showRescueList,
    showUserList,
  } = props

  const showAdmin = (showRescueList || showUserList)

  return (
    <nav className="admin">
      {showAdmin && (
        <header>Admin</header>
      )}

      <ul className="">
        {showRescueList && (
          <li>
            <Link route="admin rescues list">
              <a><span>Rescues</span></a>
            </Link>
          </li>
        )}

        {showUserList && (
          <li>
            <Link href="/admin/users">
              <a><span>Users</span></a>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}

AdminUserMenuNav.mapStateToProps = (state) => ({
  ...selectSession(state),
  showRescueList: userHasPermission(withCurrentUserId(selectUserGroups)(state), 'rescue.write'),
  showUserList: userHasPermission(withCurrentUserId(selectUserGroups)(state), 'user.write'),
})





export default connect(AdminUserMenuNav)
