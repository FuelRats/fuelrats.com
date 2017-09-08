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
import Page from '../components/Page'





class PasswordReset extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    return (
      <Page title={this.title}>
        <header className="page-header">
          <h2>{this.title}</h2>
        </header>

        <div className="page-content">

        </div>
      </Page>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get title () {
    return 'Password Reset'
  }
}






const mapDispatchToProps = dispatch => {
  return {
//    showDialog: bindActionCreators(actions.showDialog, dispatch),
  }
}





export default withRedux(initStore, null, mapDispatchToProps)(PasswordReset)
