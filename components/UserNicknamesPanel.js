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





class UserNicknamesPanel extends Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    let { nicknames } = this.props

    return (
      <div className="panel user-nicknames">
        <header>IRC Nicknames</header>

        <div className="panel-content">
          <div className="row">
            <ul>
              {nicknames && nicknames.map((nickname, index) => <li key={index}>{nickname}</li>)}
            </ul>
          </div>

          <form className="row">
            <input className="stretch-9" name="add-nickname" placeholder="Add a nickname..." type="text" />
            <button data-action="add-nickname" type="submit">Add</button>
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





export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(UserNicknamesPanel)
