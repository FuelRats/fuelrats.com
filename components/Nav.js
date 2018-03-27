// Module imports
import React from 'react'

// Component imports
import { Link } from '../routes'

// Constants
const links = {
  Blog: {
    route: 'blog list',
  },
  'Stories, Art, & Toons': {
    route: 'blog list category',
    params: {
      category: '138',
    },
  },
  Statistics: {
    route: '/statistics',
  },
  Leaderboard: {
    route: '/leaderboard',
  },
  Donate: {
    route: '/donate',
  },
}


export default () => {
  const renderedLinks = []

  for (const [name, props] of Object.entries(links)) {
    renderedLinks.push((
      <li key={name}>
        <Link {...props}>
          <a><span>{name}</span></a>
        </Link>
      </li>
    ))
  }

  return (
    <nav>
      <ul>
        {renderedLinks}
      </ul>
    </nav>
  )
}
