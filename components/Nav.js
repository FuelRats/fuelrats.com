// Module imports
import Link from 'next/link'
import React from 'react'





// Constants
const links = {
  'Blog': {
    href: '/blog/all',
    as: '/blog',
  },
  'Statistics': {
    href: '/statistics',
  },
  'Leaderboard': {
    href: '/leaderboard',
  },
}





export default class extends React.Component {
  render () {
    let renderedLinks = []

    for (let linkName in links) {
      renderedLinks.push(
        <li key={linkName}>
          <Link {...links[linkName]}>
            <a><span>{linkName}</span></a>
          </Link>
        </li>
      )
    }

    return (
      <nav>
        <ul>
          {renderedLinks}
        </ul>
      </nav>
    )
  }
}
