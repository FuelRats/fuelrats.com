// Module imports
import React from 'react'
import { createSelector } from 'reselect'





// Component imports
import userHasPermission from '~/helpers/userHasPermission'
import { connect } from '~/store'
import { selectCurrentUserScopes } from '~/store/selectors/users'

import NavItem from './NavItem'





function NavSection (props) {
  const {
    header,
    items,
    onItemClick,
    permitted,
  } = props

  if (!permitted) {
    return null
  }

  return (
    <nav>
      {header && (<header>{header}</header>)}
      <ul>
        {
          items.map((item) => {
            return (item.permission && <NavItem key={item.key} item={item} onClick={onItemClick} />)
          })
        }
      </ul>
    </nav>
  )
}



NavSection.mapStateToProps = createSelector(
  [
    (state, ownProps) => {
      return ownProps.items
    },
    selectCurrentUserScopes,
  ],
  (items, permissions) => {
    let permitted = false

    const resolvedItems = items.map(({ permission, ...restItem }) => {
      console.log(permissions, permission, permissions.includes(permission))
      const resolvedPermission = typeof permission === 'string' ? userHasPermission(permissions, permission) : true

      if (resolvedPermission) {
        permitted = true
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
