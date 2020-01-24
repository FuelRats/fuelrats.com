import routes from '@fuelrats/next-named-routes'

const { Link, Router } = routes()
  // Front Page
  .add('home', '/')
  .add('rescue-landing', '/i-need-fuel')

  // Paperwork
  .add('paperwork', '/paperwork/[rescueId]', ({ rescueId }) => `/paperwork/${rescueId}`)
  .add('paperwork edit', '/paperwork/[rescueId]/edit', ({ rescueId }) => `/paperwork/${rescueId}/edit`)

  // Profile
  .add('profile', '/profile/[tab]', ({ tab }) => `/profile/${tab || 'overview'}`)

  // Register
  .add('register', '/register')

  // Authentication
  .add('auth authorize', '/authorize')
  .add('auth forgot-pass', '/forgot-password')
  .add('auth password-reset', '/password-reset')

  // Blog
  .add('blog list', ({
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
  })

  .add('blog view', '/blog/[blogId]', ({ blogId }) => `/blog/${blogId}`)

  // Administration
  .add('admin rescues list', '/admin/rescues')

  // Statistics
  .add('stats leaderboard', '/leaderboard')

  // Donate
  .add('donate', '/donate')

  // About
  .add('about fuelrats', '/about')
  .add('about acknowledgements', '/acknowledgements')
  .add('about version', ({ raw }) => `/version/${raw ? 'raw' : 'index'}`)

  // Epics
  .add('epic nominate', '/epic/nominate')

  // Wordpress
  .add('wordpress', '/[slug]', ({ slug }) => `/${slug}`)


export {
  Link,
  Router,
}
