import getConfig from 'next/config'
import Image from 'next/image'
import { useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import { setFlag } from '~/store/actions/flags'
import { logout } from '~/store/actions/session'
import {
  selectSession,
  selectUserById,
  selectAvatarByUserId,
  withCurrentUserId,
  selectCurrentUserCanEditAllRescues,
} from '~/store/selectors'

import { Nav, NavLink, NavSection } from '../Nav'
import styles from './UserMenu.module.scss'





const { publicRuntimeConfig } = getConfig()
const { appUrl } = publicRuntimeConfig





function UserMenu () {
  const checkboxRef = useRef()

  const { loggedIn } = useSelector(selectSession)
  const userCanSeeRescueAdmin = useSelector(selectCurrentUserCanEditAllRescues)
  const user = useSelector(withCurrentUserId(selectUserById))
  const userAvatar = useSelectorWithProps({ size: 64 }, withCurrentUserId(selectAvatarByUserId))

  const dispatch = useDispatch()

  const handleClick = useCallback(() => {
    checkboxRef.current.checked = false
  }, [])

  const handleLogin = useCallback(() => {
    dispatch(setFlag('showLoginDialog', true))
  }, [dispatch])

  const handleLogout = useCallback(() => {
    dispatch(logout())
  }, [dispatch])

  return (
    <div className={[styles.userMenu, { [styles.loggedIn]: loggedIn }]}>
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

              <label className={[styles.avatar, styles.navHandle]} htmlFor="UserMenuControl" id="UserMenuToggle">
                {
                  Boolean(user) && (
                    <Image
                      unoptimized
                      alt="User's avatar"
                      height={64}
                      src={`${appUrl}${userAvatar}`}
                      width={64} />
                  )
                }
              </label>
            </>
          )
          : (
            <button
              className="secondary"
              type="button"
              onClick={handleLogin}>
              {'Rat Login'}
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
            </NavSection>

            <NavSection className={styles.navSection} title="Admin">
              {
                userCanSeeRescueAdmin && (
                  <NavLink href="/admin/rescues">
                    {'Rescues'}
                  </NavLink>
                )
              }
            </NavSection>


            <NavSection className={styles.navSection}>
              <NavLink className="logout" href="/" onClick={handleLogout}>
                {'Logout'}
              </NavLink>
            </NavSection>
          </Nav>
        )
      }
    </div>
  )
}





export default UserMenu
