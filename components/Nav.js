// Module imports
import Link from 'next/link'
import React from 'react'



// Constants
const links = {
  Blog: {
    href: '/blog/all',
    as: '/blog',
  },
  'Stories, Art, & Toons': {
    href: '/blog/all?category=138',
    as: '/blog/category/138',
  },
  Statistics: {
    href: '/statistics',
  },
  Leaderboard: {
    href: '/leaderboard',
  },
}


export default () => {
  const renderedLinks = []

  for (const linkName in links) {
    if ({}.hasOwnProperty.call(links, linkName)) {
      /* eslint-disable function-paren-newline */
      renderedLinks.push(
        <li key={linkName}>
          <Link {...links[linkName]}>
            <a><span>{linkName}</span></a>
          </Link>
        </li>
      )
      /* eslint-enable */
    }
  }

  return (
    <nav>
      <ul>
        {renderedLinks}
      </ul>
    </nav>
  )
}
