import Document, { Html, Head, Main, NextScript } from 'next/document'

// eslint-disable-next-line import/no-unassigned-import -- side-effect: registers FA icon library
import '~/util/fontawesome/init'


// eslint-disable-next-line no-template-curly-in-string -- intentional
const noJSMessage = 'Blocking JavaScript in ${currentYear}.... You\'re just asking for trouble at this point.'


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

          <meta content="Dispatch Board" name="apple-mobile-web-app-title" />
          <meta content="yes" name="apple-mobile-web-app-capable" />
          <meta content="yes" name="mobile-web-app-capable" />
          <meta content="black-translucent" name="apple-mobile-web-app-status-bar-style" />

          <meta content="/browserconfig.xml" name="msapplication-config" />
          <meta content="#d65050" name="msapplication-TileColor" />
          <meta content="/static/favicon/mstile-144x144.png" name="msapplication-TileImage" />
          <meta content="/static/favicon/mstile-70x70.png" name="msapplication-square70x70logo" />
          <meta content="/static/favicon/mstile-150x150.png" name="msapplication-square150x150logo" />
          <meta content="/static/favicon/mstile-310x150.png" name="msapplication-wide310x150logo" />
          <meta content="/static/favicon/mstile-310x310.png" name="msapplication-square310x310logo" />

          <link href="/static/favicon/pwa-icon-180.png" rel="apple-touch-icon" sizes="180x180" />
          <link href="/static/favicon/pwa-icon-152.png" rel="apple-touch-icon" sizes="152x152" />
          <link href="/static/favicon/pwa-icon-144.png" rel="apple-touch-icon" sizes="144x144" />
          <link href="/static/favicon/pwa-icon-120.png" rel="apple-touch-icon" sizes="120x120" />
          <link href="/static/favicon/pwa-icon-114.png" rel="apple-touch-icon" sizes="114x114" />
          <link href="/static/favicon/pwa-icon-76.png" rel="apple-touch-icon" sizes="76x76" />
          <link href="/static/favicon/pwa-icon-72.png" rel="apple-touch-icon" sizes="72x72" />
          <link href="/static/favicon/pwa-icon-60.png" rel="apple-touch-icon" sizes="60x60" />
          <link href="/static/favicon/pwa-icon-57.png" rel="apple-touch-icon" sizes="57x57" />


          <link href="/static/favicon/favicon-196.png" media="(prefers-color-scheme: light)" rel="icon" sizes="196x196" type="image/png" />
          <link href="/static/favicon/favicon-96.png" media="(prefers-color-scheme: light)" rel="icon" sizes="96x96" type="image/png" />
          <link href="/static/favicon/favicon-32.png" media="(prefers-color-scheme: light)" rel="icon" sizes="32x32" type="image/png" />
          <link href="/static/favicon/favicon-16.png" media="(prefers-color-scheme: light)" rel="icon" sizes="16x16" type="image/png" />
          <link href="/static/favicon/favicon-128.png" media="(prefers-color-scheme: light)" rel="icon" sizes="128x128" type="image/png" />

          <link href="/static/favicon/favicon-196-light.png" media="(prefers-color-scheme: dark)" rel="icon" sizes="196x196" type="image/png" />
          <link href="/static/favicon/favicon-96-light.png" media="(prefers-color-scheme: dark)" rel="icon" sizes="96x96" type="image/png" />
          <link href="/static/favicon/favicon-32-light.png" media="(prefers-color-scheme: dark)" rel="icon" sizes="32x32" type="image/png" />
          <link href="/static/favicon/favicon-16-light.png" media="(prefers-color-scheme: dark)" rel="icon" sizes="16x16" type="image/png" />
          <link href="/static/favicon/favicon-128-light.png" media="(prefers-color-scheme: dark)" rel="icon" sizes="128x128" type="image/png" />

          <link href="/manifest.json" rel="manifest" />

          <link href="/favicon.ico" rel="shortcut icon" />
        </Head>

        <body>
          <noscript>{noJSMessage}</noscript>

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
