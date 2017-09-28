// Module imports
import Link from 'next/link'
import React from 'react'





// Component imports
import LoginDialog from '../components/LoginDialog'
import Page from '../components/Page'





// Component constants
const title = 'Home'





class Index extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    if (this.props.query.authenticate) {
      this.props.showDialog({
        body: (<LoginDialog />),
        closeIsVisible: true,
        menuIsVisible: false,
        title: 'Login',
      })
    }
  }

  render () {
    return (
      <section className="hero">
        <header>
          <h1>We Have Fuel. You Don't.</h1>

          <h2>Any Questions?</h2>
        </header>

        <footer className="call-to-action">
          <Link href="/i-need-fuel">
            <a className="button">Get Help</a>
          </Link>
        </footer>
      </section>
    )
  }
}





const mapDispatchToProps = ['showDialog']





export default Page(Index, title, {
  mapDispatchToProps,
})
