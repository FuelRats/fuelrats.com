// Module imports
import React from 'react'
import Link from 'next/link'





// Component imports
import Page from '../components/Page'

import I18nextPage from '../components/I18nextPage'





export default class extends I18nextPage {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    return (
      <Page title={this.title}>
        <section className="hero">
          <header>
            <h1>We Have Fuel. You Don't.</h1>
            <h2>Any Questions?</h2>
          </header>
          <footer className="call-to-action">
            <a className="button" href="/get-help">Get Help</a>
          </footer>
        </section>
      </Page>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get title () {
    return 'Home'
  }
}
