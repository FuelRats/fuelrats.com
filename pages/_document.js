import Document, { Head, Main, NextScript } from 'next/document'

export default class extends Document {
  render() {
    return (
      <html>
        <Head />

        <body>
          <div id="alert-container" />

          <Main />

          <NextScript />
        </body>
      </html>
    )
  }
}