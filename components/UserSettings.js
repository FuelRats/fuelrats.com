// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import React from 'react'
import withRedux from 'next-redux-wrapper'





// Module imports
import {
  actions,
  initStore,
} from '../store'
import Component from './Component'
import ChangePasswordForm from './ChangePasswordForm'





class UserSettings extends Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    let assistCount = 2
    let firstLimpetCount = 5
    let failureCount = 3
    let successRate = 50

    return (
      <div className="user-settings">
        <ChangePasswordForm />
      </div>
    )
  }
}





const mapDispatchToProps = dispatch => {
  return {
//    getRescuesForCMDRs: bindActionCreators(actions.getRescuesForCMDRs, dispatch),
  }
}

const mapStateToProps = state => {
  return state.user || {}
}





export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(UserSettings)
