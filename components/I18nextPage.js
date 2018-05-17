// Module imports
import React from 'react'





// Component imports
import i18next from './i18next'





export default class extends React.Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps () {
    const i18n = await i18next

    if (!i18n.isInitialized) {
      await new Promise(resolve => i18n.on('initialized', resolve))
    }

    if (!i18n.hasResourceBundle(i18n.language, i18n.options.defaultNS)) {
      await new Promise(resolve => i18n.loadResources(resolve))
    }

    return {
      t: i18n.t.bind(i18n),
    }
  }
}
