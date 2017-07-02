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





class UserStatsPanel extends Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    let assistCount = 2
    let firstLimpetCount = 5
    let failureCount = 3
    let successRate = 50

    return (
      <section className="panel" hidden>
        <table className="full-width padded stats">
          <colgroup>
            <col />

            <col />

            <col />

            <col />
          </colgroup>

          <thead>
            <tr>
              <td>Rescues</td>

              <td>Assists</td>

              <td>Failures</td>

              <td>Success Rate</td>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="rescues-count">{firstLimpetCount}</td>

              <td className="assists-count">{assistCount}</td>

              <td className="failures-count">{failureCount}</td>

              <td className="success-rate">{successRate}%</td>
            </tr>
          </tbody>
        </table>
      </section>
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





export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(UserStatsPanel)
