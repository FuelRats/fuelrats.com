// Module imports
import React from 'react'




// Component imports
import { Link } from '../../routes'





function NavItem ({ item, ...linkProps }) {
  const {
    action,
    className,
    route,
    routeParams,
    title,
  } = item

  return (
    <li className={className}>
      <Link route={route} params={routeParams}>
        <a {...linkProps} {...(action && { href: '#', onClick: action })}>
          <span>{title}</span>
        </a>
      </Link>
    </li>
  )
}




export default NavItem
