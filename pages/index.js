// Module imports
import Link from 'next/link'
import React from 'react'





// Component imports
import Page from '../components/Page'





export default class extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps ({ asPath, isServer, query }) {
    return Object.assign({
      isServer,
      path: asPath,
      query,
    }, query)
  }

  render () {
    let {
      isServer,
      path,
      query,
    } = this.props

    return (
      <Page
        isServer={isServer}
        path={path}
        query={query}
        title={this.title}>
        <section className="hero">
          <header>
            <h1>We Have Fuel. You Don't.</h1>
            <h2>Any Questions?</h2>
          </header>
          <footer className="call-to-action">
            <Link href="/get-help">
              <a className="button">Get Help</a>
            </Link>
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
