import Document, { Head, Main, NextScript } from 'next/document'
import i18next from '../components/i18next'

if (window !== undefined) {
  require('tags-input-component')
}





export default class IntlDocument extends Document {
  static async getInitialProps (context) {
    const props = await super.getInitialProps(context)

    await new Promise(resolve => i18next.on('initialized', resolve))

    return props
  }
}
