// Module imports
import React from 'react'




// Component imports
import AddNicknameForm from './AddNicknameForm'
import { connect } from '~/store'
import {
  selectUserById,
  withCurrentUserId,
} from '~/store/selectors'
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
    this.setState((state) => {
      return { formOpen: !state.formOpen }
    })
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
    const nickCount = user?.relationships.nicknames.data?.length
    const maxNicksReached = (nickCount >= MAXNICKS)

    return (
      <div className="panel user-nicknames">
        <header>
          {'IRC Nicknames'}
          <div className="controls">
            <span className="nickname-count">{`${nickCount}/${MAXNICKS}`}</span>
          </div>
        </header>

        <div className="panel-content">
          <ul>
            {
              user?.relationships.nicknames.data?.map((nickname) => {
                return (
                  <li key={nickname}>
                    <span>{nickname}</span>
                    {/* { <ConfirmActionButton
                      name={nickname}
                      onConfirm={this._handleDeleteNickname}
                      className="icon">
                      <FontAwesomeIcon icon="trash" fixedWidth />
                    </ConfirmActionButton>
                    } */}
                  </li>
                )
              }) ?? null
            }
          </ul>

          <AddNicknameForm
            disabled={maxNicksReached}
            title={maxNicksReached ? 'You\'ve used all your nicknames' : 'Add new nickname'} />
        </div>
      </div>
    )
  }




  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['deleteNickname']

  static mapStateToProps = (state) => {
    return {
      user: withCurrentUserId(selectUserById)(state),
    }
  }
}





export default UserNicknamesPanel
