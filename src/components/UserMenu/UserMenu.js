import React from 'react'

import { connect } from '~/store'
import {
  selectSession,
  selectUserById,
  selectAvatarByUserId,
  withCurrentUserId,
} from '~/store/selectors'

import NavSection from './NavSection'





@connect
class UserMenu extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  checkboxRef = React.createRef()

   userItems = [
     {
       key: 'profile',
       title: 'Profile',
       route: 'profile',
       routeParams: { tab: 'overview' },
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

   adminItems = [
     {
       key: 'admin-rescues-list',
       title: 'Rescues',
       route: 'admin rescues list',
       permission: 'rescues.write',
     },
     // {
     //   key: 'admin-users',
     //   title: 'Users',
     //   permission: 'user.write',
     // },
   ]

   actions = [
     {
       key: 'logout',
       title: 'Logout',
       route: 'home',
       className: 'logout',
       onClick: this.props.logout,
     },
   ]





   /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleItemClick = () => {
    this.checkboxRef.current.checked = false
  }

  _handleLoginClick = () => {
    this.props.setFlag('showLoginDialog', true)
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      loggedIn,
      user,
      userAvatar,
      userId,
    } = this.props

    return (
      <div className={['user-menu', { 'logged-in': loggedIn, 'logging-in': loggedIn && !userId }]}>
        {
          Boolean(loggedIn) && (
            <>
              <input
                ref={this.checkboxRef}
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
              <NavSection items={this.userItems} onItemClick={this._handleItemClick} />
              <NavSection header="Admin" items={this.adminItems} onItemClick={this._handleItemClick} />
              <NavSection items={this.actions} onItemClick={this._handleItemClick} />
            </menu>
          )
        }

        {
          !loggedIn && (
            <button
              className="login secondary"
              type="button"
              onClick={this._handleLoginClick}>
              {'Rat Login'}
            </button>
          )
        }
      </div>
    )
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['logout', 'setFlag']

  static mapStateToProps = (state) => {
    return {
      ...selectSession(state),
      user: withCurrentUserId(selectUserById)(state),
      userAvatar: withCurrentUserId(selectAvatarByUserId)(state, { size: 64 }),
    }
  }
}





export default UserMenu
