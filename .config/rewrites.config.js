module.exports = () => {
  return () => {
    return {
      beforeFiles: [
        {
          // Apple demands this be on the site root, but all api routes must be in /api. oof.
          source: '/.well-known/apple-app-site-association',
          destination: '/api/apple-app-site-association',
        },
        {
          // Blog content dir.
          source: '/wp-content/:path*',
          destination: '/api/wp-content/:path*',
        },
      ],
      fallback: [
        {
          // Old blog links. yikes.
          source: '/:year/:month/:day/:slug',
          destination: '/blog/:slug',
        },
      ],
    }
  }
}
