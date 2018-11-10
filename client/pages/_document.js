// Module imports
import React from 'react'





// Module imports
import Document, { Head, Main, NextScript } from 'next/document'





class FuelRatsWebsite extends Document {
  static async getInitialProps (ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    const { nonce } = ctx.res
    return { ...initialProps, nonce }
  }

  render () {
    const { nonce } = this.props
    return (
      <html lang="en">
        <Head nonce={nonce}>
          <meta name="viewport" content="initial-scale=1.0, viewport-fit=cover, width=device-width" />

          <meta name="application-name" content="Fuel Rats" />
          <meta name="theme-color" content="#d65050" />

          <meta name="apple-mobile-web-app-title" content="Fuel Rats" />

          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="msapplication-TileColor" content="#d65050" />
          <meta name="msapplication-TileImage" content="/static/favicon/mstile-144x144.png" />
          <meta name="msapplication-square70x70logo" content="/static/favicon/mstile-70x70.png" />
          <meta name="msapplication-square150x150logo" content="/static/favicon/mstile-150x150.png" />
          <meta name="msapplication-wide310x150logo" content="/static/favicon/mstile-310x150.png" />
          <meta name="msapplication-square310x310logo" content="/static/favicon/mstile-310x310.png" />

          <link rel="apple-touch-icon-precomposed" sizes="57x57" href="/static/favicon/apple-touch-icon-57x57.png" />
          <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/static/favicon/apple-touch-icon-114x114.png" />
          <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/static/favicon/apple-touch-icon-72x72.png" />
          <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/static/favicon/apple-touch-icon-144x144.png" />
          <link rel="apple-touch-icon-precomposed" sizes="60x60" href="/static/favicon/apple-touch-icon-60x60.png" />
          <link rel="apple-touch-icon-precomposed" sizes="120x120" href="/static/favicon/apple-touch-icon-120x120.png" />
          <link rel="apple-touch-icon-precomposed" sizes="76x76" href="/static/favicon/apple-touch-icon-76x76.png" />
          <link rel="apple-touch-icon-precomposed" sizes="152x152" href="/static/favicon/apple-touch-icon-152x152.png" />


          <link rel="icon" type="image/png" href="/static/favicon/favicon-196.png" sizes="196x196" />
          <link rel="icon" type="image/png" href="/static/favicon/favicon-96.png" sizes="96x96" />
          <link rel="icon" type="image/png" href="/static/favicon/favicon-32.png" sizes="32x32" />
          <link rel="icon" type="image/png" href="/static/favicon/favicon-16.png" sizes="16x16" />
          <link rel="icon" type="image/png" href="/static/favicon/favicon-128.png" sizes="128x128" />

          <link rel="manifest" href="/manifest.json" />

          <link rel="shortcut icon" href="/static/favicon/favicon.ico" />

          <script id="stripe-js" src="https://js.stripe.com/v3/" nonce={nonce} async defer />
        </Head>

        <body>
          <noscript>Javascript is required to view this site.</noscript>

          <Main className="next-wrapper" />

          <NextScript nonce={nonce} />

          <div id="dialog-container" />

          <div id="alert-container" />
        </body>
      </html>
    )
  }
}



export default FuelRatsWebsite
