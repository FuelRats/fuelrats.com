import routes from '@fuelrats/next-named-routes'
import NextLink from 'next/link'
import * as NextRouter from 'next/router'





const { Link, Router } = routes(NextLink, NextRouter)

  // Front Page
  .add('home', '/')
  .add('rescue-landing', '/i-need-fuel')

  // Paperwork
  .add('paperwork', '/paperwork/[rescueId]')


  .add('paperwork edit', '/paperwork/[rescueId]/edit')

  // Profile
  .add('profile', '/profile/[tab]')

  // Register
  .add('register', '/register')

  // Authentication
  .add('auth authorize', '/authorize')
  .add('auth forgot-pass', '/forgot-password')
  .add('auth password-reset', '/password-reset')

  // Blog
  .add('blog list', (params) => {
    const {
      author,
      category,
      page,
      ...query
    } = params

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

    return { href, as, query }
  })

  .add('blog view', '/blog/[blogId]')

  // Administration
  .add('admin rescues list', '/admin/rescues')

  // Statistics
  .add('stats leaderboard', '/leaderboard')

  // Donate
  .add('donate', '/donate')

  // About
  .add('about fuelrats', '/about')
  .add('about acknowledgements', '/acknowledgements')

  .add('about version', ({ raw, ...query }) => {
    return {
      href: `/version/${raw ? 'raw' : 'index'}`,
      query,
    }
  })

  // Verify
  .add('verify', '/verify')

  // Epics
  .add('epic nominate', '/epic/nominate')

  // Wordpress
  .add('wordpress', '/[slug]')





export {
  Link,
  Router,
}
