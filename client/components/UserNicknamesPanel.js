// Module imports
import React from 'react'





// Component imports
import { connect } from '../store'
import AddNicknameForm from './AddNicknameForm'
// import ConfirmActionButton from './ConfirmActionButton'
import Component from './Component'





@connect
class UserNicknamesPanel extends Component {
  _deleteNickname = async (event) => {
    await this.props.deleteNickname(event.target.name)
    return 'Deleted!'
  }

  render () {
    const {
      user,
    } = this.props

    return (
      <div className="panel user-nicknames">
        <header>IRC Nicknames</header>

        <div className="panel-content">
          <ul>
            {(user.attributes && user.attributes.nicknames)
              && user.attributes.nicknames.map((nickname) => (
                <li key={nickname}>
                  <span>{nickname}</span>
                  {/* Disabled due to problems with current implementation of IRC nick management.
                      Re-enable after LDAP integration.
                  <ConfirmActionButton
                    name={nickname}
                    onConfirm={this._deleteNickname}>
                    Delete
                  </ConfirmActionButton>
                  */}
                </li>
              ))}
          </ul>
        </div>
        <footer>
          <AddNicknameForm />
        </footer>
      </div>
    )
  }





  static mapDispatchToProps = ['deleteNickname']

  static mapStateToProps = (state) => ({ user: state.user })
}





export default UserNicknamesPanel
