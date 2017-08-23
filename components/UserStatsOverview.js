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





class UserStatsOverview extends Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    let assistCount = 2
    let firstLimpetCount = 5
    let failureCount = 3
    let successRate = 50

    return (
      <div className="user-stats-overview">
        <div className="rescues-count stat">
          <data value={firstLimpetCount}>{firstLimpetCount}</data>
          <small>rescues</small>
        </div>

        <div className="assists-count stat">
          <data value={assistCount}>{assistCount}</data>
          <small>assists</small>
        </div>

        <div className="failures-count stat">
          <data value={failureCount}>{failureCount}</data>
          <small>failures</small>
        </div>

        <div className="stat success-rate">
          <data value={successRate}>{successRate}%</data>
          <small>success</small>
        </div>
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





export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(UserStatsOverview)
