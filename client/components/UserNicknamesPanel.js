// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'




// Component imports
import { connect } from '../store'
import {
  selectUserById,
  withCurrentUserId,
} from '../store/selectors'
import AddNicknameForm from './AddNicknameForm'
// import ConfirmActionButton from './ConfirmActionButton'

// Component constants
const MAXNICKS = 16 // Maximum IRC Nicknames allowed



@connect
class UserNicknamesPanel extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    formOpen: false,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleFormVisibilityToggle = () => {
    this.setState((state) => ({ formOpen: !state.formOpen }))
  }

  _handleDeleteNickname = async (event) => {
    await this.props.deleteNickname(event.target.name)
    return 'Deleted!'
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      user,
    } = this.props
    const maxNicksReached = (user.attributes.nicknames.length >= MAXNICKS)

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
              onClick={this._handleFormVisibilityToggle}
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
      </div>
    )
  }




  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['deleteNickname']

  static mapStateToProps = (state) => ({
    user: withCurrentUserId(selectUserById)(state),
  })
}





export default UserNicknamesPanel
