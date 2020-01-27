import routes from '@fuelrats/next-named-routes'
import NextLink from 'next/link'
import * as NextRouter from 'next/router'


const routeList = [
  // Front Page
  ['home', '/'],
  ['rescue-landing', '/i-need-fuel'],

  // Paperwork
  ['paperwork', '/paperwork/[rescueId]', ({ rescueId }) => `/paperwork/${rescueId}`],
  ['paperwork edit', '/paperwork/[rescueId]/edit', ({ rescueId }) => `/paperwork/${rescueId}/edit`],

  // Profile
  ['profile', '/profile/[tab]', ({ tab }) => `/profile/${tab || 'overview'}`],

  // Register
  ['register', '/register'],

  // Authentication
  ['auth authorize', '/authorize'],
  ['auth forgot-pass', '/forgot-password'],
  ['auth password-reset', '/password-reset'],

  // Blog
  ['blog list', ({
    author,
    category,
    page,
  }) => {
    let href = '/blog'
    let as = '/blog'

    if (author) {
      href += '/author/[author]'
      as += `/author/${author}`
    } else if (category) {
      href += '/category/[category]'
      as += `/category/${category}`
    }

    if (typeof page === 'number') {
      href += '/page/[page]'
      as += `/page/${page}`
    }

    return { href, as }
  }],

  ['blog view', '/blog/[blogId]', ({ blogId }) => `/blog/${blogId}`],

  // Administration
  ['admin rescues list', '/admin/rescues'],

  // Statistics
  ['stats leaderboard', '/leaderboard'],

  // Donate
  ['donate', '/donate'],

  // About
  ['about fuelrats', '/about'],
  ['about acknowledgements', '/acknowledgements'],
  ['about version', ({ raw }) => `/version/${raw ? 'raw' : 'index'}`],

  // Epics
  ['epic nominate', '/epic/nominate'],

  // Wordpress
  ['wordpress', '/[slug]', ({ slug }) => `/${slug}`],
]





const { Link, Router } = routes(NextLink, NextRouter, routeList)





export {
  Link,
  Router,
}
