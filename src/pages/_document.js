import Document, { Html, Head, Main, NextScript } from 'next/document'





class FuelRatsWebsite extends Document {
  static async getInitialProps (ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    const { nonce } = ctx.res
    return { ...initialProps, nonce }
  }

  render () {
    const { nonce } = this.props
    return (
      <Html lang="en">
        <Head nonce={nonce}>
          <meta content="Fuel Rats" name="application-name" />
          <meta content="#d65050" name="theme-color" />

          <meta content="Fuel Rats" name="apple-mobile-web-app-title" />

          <meta content="/browserconfig.xml" name="msapplication-config" />
          <meta content="#d65050" name="msapplication-TileColor" />
          <meta content="/static/favicon/mstile-144x144.png" name="msapplication-TileImage" />
          <meta content="/static/favicon/mstile-70x70.png" name="msapplication-square70x70logo" />
          <meta content="/static/favicon/mstile-150x150.png" name="msapplication-square150x150logo" />
          <meta content="/static/favicon/mstile-310x150.png" name="msapplication-wide310x150logo" />
          <meta content="/static/favicon/mstile-310x310.png" name="msapplication-square310x310logo" />

          <link href="/static/favicon/apple-touch-icon-57x57.png" rel="apple-touch-icon-precomposed" sizes="57x57" />
          <link href="/static/favicon/apple-touch-icon-114x114.png" rel="apple-touch-icon-precomposed" sizes="114x114" />
          <link href="/static/favicon/apple-touch-icon-72x72.png" rel="apple-touch-icon-precomposed" sizes="72x72" />
          <link href="/static/favicon/apple-touch-icon-144x144.png" rel="apple-touch-icon-precomposed" sizes="144x144" />
          <link href="/static/favicon/apple-touch-icon-60x60.png" rel="apple-touch-icon-precomposed" sizes="60x60" />
          <link href="/static/favicon/apple-touch-icon-120x120.png" rel="apple-touch-icon-precomposed" sizes="120x120" />
          <link href="/static/favicon/apple-touch-icon-76x76.png" rel="apple-touch-icon-precomposed" sizes="76x76" />
          <link href="/static/favicon/apple-touch-icon-152x152.png" rel="apple-touch-icon-precomposed" sizes="152x152" />


          <link href="/static/favicon/favicon-196.png" rel="icon" sizes="196x196" type="image/png" />
          <link href="/static/favicon/favicon-96.png" rel="icon" sizes="96x96" type="image/png" />
          <link href="/static/favicon/favicon-32.png" rel="icon" sizes="32x32" type="image/png" />
          <link href="/static/favicon/favicon-16.png" rel="icon" sizes="16x16" type="image/png" />
          <link href="/static/favicon/favicon-128.png" rel="icon" sizes="128x128" type="image/png" />

          <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital@0;1&family=Raleway" rel="stylesheet" />

          <link href="/manifest.json" rel="manifest" />

          <link href="/favicon.ico" rel="shortcut icon" />

          <script async defer id="stripe-js" nonce={nonce} src="https://js.stripe.com/v3/" />
        </Head>

        <body>
          <noscript>{'Javascript is required to view this site, silly!'}</noscript>

          <Main className="next-wrapper" />

          <NextScript nonce={nonce} />

          <div id="ModalContainer" />

          <div id="alert-container" />
        </body>
      </Html>
    )
  }
}





export default FuelRatsWebsite
