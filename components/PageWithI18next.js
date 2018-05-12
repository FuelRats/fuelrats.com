// Module imports
import React from 'react'





// Component imports
import Component from './Component'
import i18next from '../i18next/i18next'
import i18nextOptions from '../i18next/options'





class Page extends Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps (context) {
    let props = {}

    if (typeof Page.getInitialProps === 'function') {
      props = await Page.getInitialProps(context)
    }

    if (!i18next.isInitialized) {
      await new Promise((resolve, reject) => {
        i18next.init(i18nextOptions, error => {
          if (error) {
            return reject(error)
          }

          return resolve()
        })
      })
    }

    if (!i18next.hasResourceBundle(i18next.language, i18next.options.defaultNS)) {
      await new Promise(resolve => i18next.loadResources(resolve))
    }

    props.t = i18next.t.bind(i18next)

    return props
  }

  render () {
    return (
      <Page {...this.props} />
    )
  }
}


export default Page
