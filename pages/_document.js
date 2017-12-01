import Document, { Head, Main, NextScript } from 'next/document'

export default class extends Document {
  render() {
    return (
      <html>
        <Head />

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