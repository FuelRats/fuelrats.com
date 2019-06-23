// Module imports
import React from 'react'




// Component imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from '../store'
import { selectUser } from '../store/selectors'
import AddNicknameForm from './AddNicknameForm'
// import ConfirmActionButton from './ConfirmActionButton'
import Component from './Component'

// Component constants
const MAXNICKS = 20 // Maximum IRC Nicknames allowed



@connect
class UserNicknamesPanel extends Component {
  _handleDeleteNickname = async (event) => {
    await this.props.deleteNickname(event.target.name)
    return 'Deleted!'
  }

  state = {
    formOpen: false,
  }

  _handleToggle = () => {
    this.setState((state) => ({
      ...state,
      formOpen: !state.formOpen,
    }))
  }

  render () {
    const {
      user,
    } = this.props
    const maxNicksReached = (user.attributes.nicknames.length === MAXNICKS)

    return (
      <div className="panel user-nicknames">
        <header>IRC Nicknames
          {(this.state.formOpen) && (
            <div className="add-nickname-float">
              <AddNicknameForm />
            </div>
          )}
          <div className="controls">
            <span className="nickname-count">{user.attributes.nicknames.length}/{MAXNICKS}</span>
            <button
              aria-label="add nickname"
              className={`icon ${this.state.formOpen ? '' : 'green'}`}
              onClick={this._handleToggle}
              title={maxNicksReached ? 'You\'ve used all your nicknames' : 'Add new nickname'}
              type="button"
              disabled={maxNicksReached}>
              <FontAwesomeIcon icon={this.state.formOpen ? 'times' : 'plus'} fixedWidth />
            </button>
          </div>
        </header>

        <div className="panel-content">
          <ul>
            {(user.attributes && user.attributes.nicknames)
              && user.attributes.nicknames.map((nickname) => (
                <li key={nickname}>
                  <span>{nickname}</span>
                  {/* <ConfirmActionButton
                    name={nickname}
                    onConfirm={this._handleDeleteNickname}
                    className="icon">
                    <FontAwesomeIcon icon="trash" fixedWidth />
                  </ConfirmActionButton>
                  */}
                </li>
              ))}
          </ul>
        </div>
        {/* (this.state.formOpen) && (
          <footer>
            <AddNicknameForm />
          </footer>
        ) */}
      </div>
    )
  }





  static mapDispatchToProps = ['deleteNickname']

  static mapStateToProps = (state) => ({
    user: selectUser(state),
  })
}





export default UserNicknamesPanel
