import Document, { Head, Main, NextScript } from 'next/document'

export default class extends Document {
  render() {
    return (
      <html>
        <Head>
          <link href="//cdnjs.cloudflare.com/ajax/libs/dialog-polyfill/0.4.8/dialog-polyfill.min.css" rel="stylesheet" />
          <script src="//cdnjs.cloudflare.com/ajax/libs/dialog-polyfill/0.4.8/dialog-polyfill.min.js"></script>
        </Head>

        <body>
          <div id="alert-container" />

          <div id="dialog-container" />

          <Main className="next-wrapper" />

          <NextScript />
        </body>
      </html>
    )
  }
}