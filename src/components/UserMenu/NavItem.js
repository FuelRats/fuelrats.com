// Module imports
import React from 'react'




// Component imports
import { Link } from '~/routes'





function NavItem ({ item, ...linkProps }) {
  const {
    onClick,
    className,
    route,
    routeParams,
    title,
  } = item

  return (
    <li className={className}>
      <Link params={routeParams} route={route}>
        <a {...linkProps} {...(onClick ? { href: '#', onClick } : {})}>
          <span>{title}</span>
        </a>
      </Link>
    </li>
  )
}




export default NavItem
