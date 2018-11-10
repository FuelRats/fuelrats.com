// Module imports
import React from 'react'





// Component imports
import { Link } from '../routes'
import { connect } from '../store'
import PageWrapper from '../components/PageWrapper'




@connect
class Index extends React.Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    if (this.props.query.authenticate) {
      this.props.setFlag('showLoginDialog', true)
    }
  }

  render = () => (
    <PageWrapper title="Home" renderHeader={false}>
      <section className="hero">
        <header>
          <h1>We Have Fuel. You Don't.</h1>
          <h2>Any Questions?</h2>
        </header>

        <footer className="call-to-action">
          <Link href="/i-need-fuel">
            <a className="button tall">Get Help</a>
          </Link>
        </footer>
      </section>
    </PageWrapper>
  )

  static mapDispatchToProps = ['setFlag']
}





export default Index
