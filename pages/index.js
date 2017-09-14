// Module imports
import Link from 'next/link'
import React from 'react'





// Component imports
import Page from '../components/Page'





// Component constants
const title = 'Home'





class Home extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    return (
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
    )
  }
}





export default Page(Home, title)
