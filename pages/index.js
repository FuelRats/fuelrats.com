// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import Link from 'next/link'
import React from 'react'
import withRedux from 'next-redux-wrapper'





// Component imports
import {
  actions,
  initStore,
} from '../store'
import LoginDialog from '../components/LoginDialog'
import Page from '../components/Page'





class Home extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    if (this.props.authenticate) {
      this.showLogin()
    }
  }

  static async getInitialProps ({ asPath, isServer, query }) {
    return Object.assign({
      isServer,
      path: asPath,
    }, query)
  }

  render () {
    let {
      isServer,
      path,
    } = this.props

    return (
      <Page
        isServer={isServer}
        path={path}
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

  showLogin () {
    this.props.showDialog({
      body: (<LoginDialog />),
      closeIsVisible: true,
      menuIsVisible: false,
      title: 'Login',
    })
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get title () {
    return 'Home'
  }
}






const mapDispatchToProps = dispatch => {
  return {
    showDialog: bindActionCreators(actions.showDialog, dispatch),
  }
}





export default withRedux(initStore, null, mapDispatchToProps)(Home)
