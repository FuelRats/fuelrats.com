const routes = (module.exports = require('next-routes')())

// 'NAME', 'ROUTE', 'PATH'
routes
  // About
  .add('about acknowledgements', '/acknowledgements', '/acknowledgements')

  // Paperwork
  .add('paperwork', '/paperwork/:id', '/paperwork/view')
  .add('paperwork edit', '/paperwork/:id/edit', '/paperwork/edit')
  .add('paperwork view', '/paperwork/:id/view', '/paperwork/view')

  // Blog
  .add('blog list author page', '/blog/author/:author/page/:page', '/blog/all')
  .add('blog list author', '/blog/author/:author', '/blog/all')

  .add('blog list category page', '/blog/category/:category/page/:page', '/blog/all')
  .add('blog list category', '/blog/category/:category', '/blog/all')

  .add('blog list page', '/blog/page/:page', '/blog/all')
  .add('blog list', '/blog', '/blog/all')

  .add('blog view', '/blog/:id', '/blog/single')

  // Epics
  .add('epic nominate', '/epic/nominate', '/epics/nominate')

  // Wordpress
  .add('wordpress', '/:slug+', '/wordpress-proxy')
