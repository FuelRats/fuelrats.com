module.exports = (env) => {
  return () => {
    return ([
      {
        // All IE traffic should go to fallbackUrl.
        source: '/:path*',
        destination: env.fallbackUrl,
        permanent: false,
        basePath: false,
        has: [
          {
            type: 'header',
            key: 'User-Agent',
            value: '(.*Trident.*)',
          },
        ],
      },
      {
        // Temporary workaround so canceled donations return to donate screen
        source: '/donate/cancel',
        destination: '/donate',
        permanent: false,
      },
      {
        // Profile page requires a tab name in the path
        source: '/profile',
        destination: '/profile/overview',
        permanent: true,
      },
      {
        // Old blog used to exist at /blogs
        source: '/blogs',
        destination: '/blog',
        permanent: true,
      },
      {
        // get-help was used at launch of the website, but has since been changed back.
        source: '/get-help',
        destination: '/i-need-fuel',
        permanent: true,
      },
      {
        // Common endpoint for privacy policies
        source: '/privacy',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        // Lexicon is no longer local
        source: '/fuel-rats-lexicon',
        destination: 'https://confluence.fuelrats.com/pages/viewpage.action?pageId=3637257',
        permanent: true,
        basePath: false,
      },
      {
        // statistics are no longer local
        source: '/statistics',
        destination: 'https://grafana.fuelrats.com',
        permanent: true,
        basePath: false,
      },
      {
        // People often type this one manually into their URL bar to get to the helpdesk
        source: '/help',
        destination: 'https://t.fuelr.at/help',
        permanent: true,
        basePath: false,
      },
    ])
  }
}
