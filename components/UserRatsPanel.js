// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import Link from 'next/link'
import React from 'react'
import withRedux from 'next-redux-wrapper'





// Module imports
import {
  actions,
  initStore,
} from '../store'
import Component from './Component'





class UserRatsPanel extends Component {

  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _renderRats (rats) {
    return rats.map((rat, index) => {
      let {
        CMDRname,
        id,
        platform,
      } = rat
      let badgeClasses = ['badge', 'platform', 'short', platform].join(' ')

      return (
        <li key={index}>
          <div className={badgeClasses}></div>

          <Link href={`/rats/${id}`}>
            <a>{CMDRname}</a>
          </Link>
        </li>
      )
    })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentWillMount () {
    let {
      CMDRs,
      getRats,
      rats,
    } = this.props

    if (CMDRs && !rats) {
      getRats(CMDRs)
    }
  }

  render () {
    let {
      id,
      rats,
    } = this.props

    return (
      <div className="panel">
        <header>Rats</header>

        <div className="panel-content user-rats-panel">
          <div className="row">
            {rats && (
              <ul>{this._renderRats(rats)}</ul>
            )}

            {!rats && 'Loading rat info...'}
          </div>

          <form className="row">
            <input className="stretch-9" name="add-rat" placeholder="Add a rat..." />
            <button data-action="add-rat" type="submit">Add</button>
          </form>
        </div>
      </div>
    )
  }
}





const mapDispatchToProps = dispatch => {
  return {
    getRats: bindActionCreators(actions.getRats, dispatch),
  }
}

const mapStateToProps = state => {
  return state.user || {}
}





export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(UserRatsPanel)
