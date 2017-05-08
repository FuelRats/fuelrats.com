// Module imports
import React from 'react'





// Component imports
import i18next from './i18next'





export default class extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps () {
    console.log('Getting initial props...')
    let i18n = await i18next
    console.log('i18next has initialized')

    if (!i18n.isInitialized) {
      await new Promise(resolve => i18n.on('initialized', resolve))
    }

    if (!i18n.hasResourceBundle(i18n.language, i18n.options.defaultNS)) {
      console.log(`i18next is missing the ${i18n.language}/${i18n.options.defaultNS} bundle`)
      await new Promise(resolve => i18n.loadResources(resolve))
      console.log(`i18next got the ${i18n.language}/${i18n.options.defaultNS} bundle`)

    } else {
      console.log(`i18next already has the ${i18n.language}/${i18n.options.defaultNS} bundle`)
    }

    return {
      t: i18n.t.bind(i18n)
    }
  }
}
