// Module imports
import React from 'react'
import { createSelector } from 'reselect'




// Component imports
import { connect } from '../../store'
import { withCurrentUserId, selectUserGroups } from '../../store/selectors'
import userHasPermission from '../../helpers/userHasPermission'
import NavItem from './NavItem'





const NavSection = (props) => {
  const {
    header,
    items,
    onItemClick,
    permitted,
  } = props

  if (permitted) {
    return (
      <nav>
        {header && (<header>{header}</header>)}
        <ul>
          {items.map((item) => (item.permission && <NavItem key={item.key} item={item} onClick={onItemClick} />))}
        </ul>
      </nav>
    )
  }

  return null
}



NavSection.mapStateToProps = createSelector(
  [
    (state, ownProps) => ownProps.items,
    withCurrentUserId(selectUserGroups),
  ],
  (items, userGroups) => {
    let permitted = true
    const resolvedItems = items.map(({ permission, ...restItem }) => {
      const resolvedPermission = typeof permission === 'string' ? userHasPermission(userGroups, permission) : true

      if (!resolvedPermission) {
        permitted = false
      }

      return {
        ...restItem,
        permission: resolvedPermission,
      }
    })

    return {
      items: resolvedItems,
      permitted,
    }
  },
)


export default connect(NavSection)
