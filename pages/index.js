// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
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

  static async getInitialProps ({ query }) {
    return query || {}
  }

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

  showLogin () {
    this.props.showDialog({
      body: (<LoginDialog />),
      closeIsVisible: true,
      menuIsVisible: false,
      title: 'Login',
    })
  }
}






const mapDispatchToProps = dispatch => {
  return {
    showDialog: bindActionCreators(actions.showDialog, dispatch),
  }
}





export default withRedux(initStore, null, mapDispatchToProps)(Home)
