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





class UserShipsPanel extends Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    let { ships } = this.props

    return (
      <div className="panel user-ships">
        <header>Ships</header>

        <div className="panel-content">
          <div className="row">
            <ul>
              {ships && ships.map((ship, index) => <li key={index}>{ship}</li>)}
            </ul>
          </div>

          <form className="row">
            <input className="stretch-9" name="add-ship" placeholder="Add a ship..." type="text" />
            <button data-action="add-ship" type="submit">Add</button>
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





export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(UserShipsPanel)
