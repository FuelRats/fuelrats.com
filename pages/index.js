// Module imports
import React from 'react'
import PropTypes from 'prop-types'





// Component imports
import { Link } from '../routes'
import Page from '../components/Page'





// Component constants
const title = 'Home'





class Index extends React.Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    if (this.props.query.authenticate) {
      this.props.setFlag('showLoginDialog', true)
    }
  }

  render () {
    return (
      <section className="hero">
        <header>
          <h1>We Have Fuel. You Don&apos;t.</h1>

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





Index.propTypes = {
  query: PropTypes.object.isRequired,
}


export default Page(title, false, null, ['setFlag'])(Index)
