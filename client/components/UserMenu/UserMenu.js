// Module imports
import React, { useCallback, useEffect, useRef } from 'react'





// Component imports
import { connect } from '../../store'
import {
  selectSession,
  selectUserById,
  selectAvatarByUserId,
  withCurrentUserId,
} from '../../store/selectors'
import NavSection from './NavSection'





const userItems = [
  {
    key: 'profile',
    title: 'Profile',
    route: 'profile',
  },
  {
    key: 'my-rats',
    title: 'My Rats',
    route: 'profile',
    routeParams: { tab: 'rats' },
  },
  // {
  //   key: 'my-rescues',
  //   title: 'My Rescues',
  //   route: 'profile',
  //   routeParams: { tab: 'rescues' },
  // },
]


const adminItems = [
  {
    key: 'admin-rescues-list',
    title: 'Rescues',
    route: 'admin rescues list',
    permission: 'rescue.write',
  },
  // {
  //   key: 'admin-users',
  //   title: 'Users',
  //   permission: 'user.write',
  // },
]

const actions = [
  {
    key: 'logout',
    title: 'Logout',
    route: 'home',
    className: 'logout',
  },
]


const UserMenu = (props) => {
  const {
    authenticatedPage,
    loggedIn,
    logout,
    user,
    userAvatar,
    userId,
  } = props

  const checkboxRef = useRef(null)
  const closeMenu = useCallback(() => {
    checkboxRef.current.checked = false
  }, [checkboxRef])

  useEffect(() => {
    // This is a hack, but really the only way to pass this along.
    actions[0].action = () => logout(authenticatedPage)
  }, [authenticatedPage, logout])

  return (
    <div className={`user-menu ${loggedIn ? 'logged-in' : ''} ${loggedIn && !userId ? 'logging-in' : ''}`}>
      {Boolean(loggedIn) && (
        <>
          <input
            aria-label="User menu toggle"
            id="UserMenuControl"
            ref={checkboxRef}
            type="checkbox" />

          <label className="avatar medium" htmlFor="UserMenuControl" id="UserMenuToggle">
            {Boolean(user) && (
              <img alt="Your avatar" src={userAvatar} />
            )}
          </label>
        </>
      )}

      {(loggedIn && user) && (
        <menu>
          <NavSection onItemClick={closeMenu} items={userItems} />
          <NavSection onItemClick={closeMenu} header="Admin" items={adminItems} />
          <NavSection onItemClick={closeMenu} items={actions} />
        </menu>
      )}

      {!loggedIn && (
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

UserMenu.mapStateToProps = (state) => ({
  ...selectSession(state),
  user: withCurrentUserId(selectUserById)(state),
  userAvatar: withCurrentUserId(selectAvatarByUserId)(state),
})





export default connect(UserMenu)
