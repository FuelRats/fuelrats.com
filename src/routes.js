import routes from '@fuelrats/next-named-routes'





const { Link, Router, useRouter, withRouter } = routes()

  // Front Page
  .add('home', '/')
  .add('rescue-landing', '/i-need-fuel')

  // Paperwork
  .add('paperwork', '/paperwork/[rescueId]')
  .add('paperwork edit', '/paperwork/[rescueId]/edit')

  // Profile
  .add('profile', '/profile/[tab]')

  // Dispatch
  .add('dispatch', '/dispatch')

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
      href: `/version/${raw ? 'raw' : ''}`,
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
  useRouter,
  withRouter,
}
