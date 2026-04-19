import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setFlag } from '~/store/actions/flags'
import { logout } from '~/store/actions/session'
import {
  selectSession,
  selectUserById,
  withCurrentUserId,
  selectCurrentUserHasScope,
} from '~/store/selectors'

import { Nav, NavLink, NavSection } from '../Nav'
import UserAvatar from '../UserAvatar'
import styles from './UserMenu.module.scss'





function UserMenu () {
  const checkboxRef = useRef()
  const menuRef = useRef()

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (checkboxRef.current?.checked && menuRef.current && !menuRef.current.contains(event.target)) {
        checkboxRef.current.checked = false
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const { loggedIn } = useSelector(selectSession)
  const userCanDispatch = useSelector((state) => {
    return selectCurrentUserHasScope(state, { scope: 'dispatch.read' })
  })
  const userCanAdminRescues = useSelector((state) => {
    return selectCurrentUserHasScope(state, { scope: 'rescues.write' })
  })
  const user = useSelector(withCurrentUserId(selectUserById))

  const dispatch = useDispatch()

  const handleClick = useCallback(() => {
    checkboxRef.current.checked = false
  }, [])

  const handleLogin = useCallback(() => {
    dispatch(setFlag('showLoginDialog', true))
  }, [dispatch])

  const handleLogout = useCallback(async () => {
    await dispatch(logout())
    window.location.href = '/'
  }, [dispatch])

  return (
    <div ref={menuRef} className={clsx(styles.userMenu, { [styles.loggedIn]: loggedIn })}>
      {
        loggedIn
          ? (
            <>
              <input
                ref={checkboxRef}
                aria-label="User menu toggle"
                className={styles.navInput}
                id="UserMenuControl"
                type="checkbox" />

              <label className={clsx(styles.avatar, styles.navHandle)} htmlFor="UserMenuControl" id="UserMenuToggle">
                {Boolean(user) && (<UserAvatar size={64} />)}
              </label>
            </>
          )
          : (
            <button
              className={clsx('secondary', styles.loginButton)}
              type="button"
              onClick={handleLogin}>
              <FontAwesomeIcon icon="user" />
              <span className={styles.loginText}>{'Rat Login'}</span>
            </button>
          )
      }

      {
        Boolean(user) && (
          <Nav className={styles.nav} onClick={handleClick}>
            <NavSection className={styles.navSection}>
              <NavLink href="/profile/overview">
                {'Profile'}
              </NavLink>
              <NavLink href="/profile/rats">
                {'My Rats'}
              </NavLink>
              <NavLink href="/profile/rescues">
                {'My Rescues'}
              </NavLink>
              {
                userCanDispatch && (
                  <NavLink href="/dispatch">
                    {'Dispatch Board'}
                  </NavLink>
                )
              }
            </NavSection>

            {
              userCanAdminRescues && (
                <NavSection className={styles.navSection} title="Admin">
                  <NavLink href="/admin/rescues">
                    {'Rescue Search'}
                  </NavLink>
                </NavSection>
              )
            }

            <NavSection className={styles.navSection}>
              <li>
                <button
                  className="logout"
                  type="button"
                  onClick={handleLogout}>
                  <span>{'Logout'}</span>
                </button>
              </li>
            </NavSection>
          </Nav>
        )
      }
    </div>
  )
}





export default UserMenu
