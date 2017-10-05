// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'





// Module imports
import { actions } from '../store'
import AddNicknameForm from './AddNicknameForm'
import Component from './Component'





class UserNicknamesPanel extends Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    let { user } = this.props

    return (
      <div className="panel user-nicknames">
        <header>IRC Nicknames</header>

        <div className="panel-content">
          <ul>
            {user.attributes && user.attributes.nicknames && user.attributes.nicknames.map((nickname, index) => <li key={index}>{nickname}</li>)}
          </ul>
        </div>

        <footer>
          <AddNicknameForm />
        </footer>
      </div>
    )
  }
}





const mapDispatchToProps = dispatch => {
  return {}
}





const mapStateToProps = state => {
  let {
    user,
  } = state

  return {
    user
  }
}





export default connect(mapStateToProps, mapDispatchToProps)(UserNicknamesPanel)
