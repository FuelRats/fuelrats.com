const routes = require('next-routes')()

// 'NAME', 'ROUTE', 'PATH'
// Ordered in general page group priority. Priority is determined by general amount of use of the set of pages.
routes
  // Front Page
  .add('home', '/', '/index')
  .add('rescue-landing', '/i-need-fuel', '/i-need-fuel')

  // Paperwork
  .add('paperwork', '/paperwork/:rescueId', '/paperwork/view')
  .add('paperwork edit', '/paperwork/:rescueId/edit', '/paperwork/edit')
  .add('paperwork view', '/paperwork/:rescueId/view', '/paperwork/view')

  // Profile
  .add('profile', '/profile/:tab(overview|rats|settings)?', '/profile')

  // Register
  .add('register', '/register', '/register')

  // Authentication
  .add('auth authorize', '/authorize', '/authorize')
  .add('auth forgot-pass', '/forgot-password', '/forgot-password')
  .add('auth password-reset', '/password-reset', '/password-reset')

  // Blog
  .add('blog list author page', '/blog/author/:author/page/:page', '/blog/all')
  .add('blog list author', '/blog/author/:author', '/blog/all')

  .add('blog list category page', '/blog/category/:category/page/:page', '/blog/all')
  .add('blog list category', '/blog/category/:category', '/blog/all')

  .add('blog list page', '/blog/page/:page', '/blog/all')
  .add('blog list', '/blog', '/blog/all')

  .add('blog view', '/blog/:blogId', '/blog/single')

  // Administration
  .add('admin rescues list', '/admin/rescues', '/admin/rescues/list')

  // Statistics
  .add('stats leaderboard', '/leaderboard', '/leaderboard')

  // Storefront
  .add('store list', '/store/products/:page?', '/storefront/list')
  .add('store cart', '/store/cart', '/storefront/cart')
  .add('store orders', '/store/orders', '/storefront/orders')
  .add('store checkout', '/store/checkout', '/storefront/checkout')

  // About
  .add('about fuelrats', '/about', '/about')
  .add('about acknowledgements', '/acknowledgements', '/acknowledgements')
  .add('about version', '/version/:raw(raw)?', '/version')

  // Verify
  .add('verify', '/verify', '/verify')

  // Epics
  .add('epic nominate', '/epic/nominate', '/epics/nominate')

  // Other
  .add('home legacy', '/home-page', '/index')

  // Wordpress
  .add('wordpress', '/:slug+', '/wordpress-proxy')

module.exports = routes
