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

        <div className="panel-content">
          <div className="row rats">
            {rats && (
              <ul>
                {rats.map((rat, index) => {
                  return (
                    <li key={index}>
                      <Link href={`/rats/${rat.id}`}>
                        <a>{rat.CMDRname}</a>
                      </Link>
                    </li>
                  )
                })}
              </ul>
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
