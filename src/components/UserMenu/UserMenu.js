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


function UserMenu (props) {
  const {
    authenticatedPage,
    loggedIn,
    logout,
    user,
    userAvatar,
    userId,
    setFlag,
  } = props

  const checkboxRef = useRef(null)

  const handleItemClick = useCallback(() => {
    checkboxRef.current.checked = false
  }, [checkboxRef])

  const handleLoginClick = useCallback(() => {
    setFlag('showLoginDialog', true)
  }, [setFlag])

  useEffect(() => {
    // This is a hack, but really the only way to pass this along.
    actions[0].action = () => {
      return logout(authenticatedPage)
    }
  }, [authenticatedPage, logout])

  return (
    <div className={`user-menu ${loggedIn ? 'logged-in' : ''} ${loggedIn && !userId ? 'logging-in' : ''}`}>
      {
        Boolean(loggedIn) && (
          <>
            <input
              ref={checkboxRef}
              aria-label="User menu toggle"
              id="UserMenuControl"
              type="checkbox" />

            <label className="avatar medium" htmlFor="UserMenuControl" id="UserMenuToggle">
              {
                Boolean(user) && (
                  <img alt="Your avatar" src={userAvatar} />
                )
              }
            </label>
          </>
        )
      }

      {
        (loggedIn && user) && (
          <menu>
            <NavSection items={userItems} onItemClick={handleItemClick} />
            <NavSection header="Admin" items={adminItems} onItemClick={handleItemClick} />
            <NavSection items={actions} onItemClick={handleItemClick} />
          </menu>
        )
      }

      {
        !loggedIn && (
          <button
            className="login secondary"
            type="button"
            onClick={handleLoginClick}>
            {'Rat Login'}
          </button>
        )
      }
    </div>
  )
}





UserMenu.mapDispatchToProps = ['logout', 'setFlag']

UserMenu.mapStateToProps = (state) => {
  return {
    ...selectSession(state),
    user: withCurrentUserId(selectUserById)(state),
    userAvatar: withCurrentUserId(selectAvatarByUserId)(state),
  }
}





export default connect(UserMenu)
