// Module imports
import React from 'react'





// Component imports
import i18next from '../i18next/i18next'
import i18nextOptions from '../i18next/options'





export default Page => {
  return class extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

    static async getInitialProps (context) {
      let props = {}

      if (typeof Page.getInitialProps === 'function') {
        props = await Page.getInitialProps(context)
      }

      if (!i18next.isInitialized) {
        await new Promise(resolve => {
          i18next.init(i18nextOptions, error => {
            if (error) {
              return reject(error)
            }

            console.log('Resolving!')
            return resolve()
          })
        })
        console.log('Done awaiting the promise.')
      }

      if (!i18next.hasResourceBundle(i18next.language, i18next.options.defaultNS)) {
        await new Promise(resolve => i18next.loadResources(resolve))
      }

      props.t = i18next.t.bind(i18next)

      return props
    }

    render () {
      console.log('Rendering', i18next.t)

      return (
        <Page {...this.props} />
      )
    }
  }
}
