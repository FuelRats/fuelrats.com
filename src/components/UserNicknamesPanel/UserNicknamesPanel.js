// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'




// Component imports
import AddNicknameForm from '../AddNicknameForm/AddNicknameForm'
import ConfirmActionButton from '../ConfirmActionButton'
import styles from './UserNicknamesPanel.module.scss'
import { connect } from '~/store'
import {
  selectUserById,
  withCurrentUserId,
  selectNicknamesByUserId,
} from '~/store/selectors'

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
    await this.props.deleteNickname(this.props.user, this.props.nicknames.find((nick) => {
      return nick.id === event.target.name
    }))
    return 'Deleted!'
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      nicknames,
    } = this.props

    const nickCount = nicknames?.length
    const maxNicksReached = (nickCount >= MAXNICKS)

    return (
      <div className="panel">
        <header>
          {'IRC Nicknames'}

          <div className="controls">
            <span className="nickname-count">{`${nickCount}/${MAXNICKS}`}</span>
          </div>
        </header>

        <div className={styles.userNicknames}>
          <ul>
            {(nickCount <= 0) && (<li className="text-center">{'You do not have any nicknames registered yet.'}</li>)}
            {
              nicknames?.map((nickname) => {
                return (
                  <li key={nickname.id}>
                    <span>{nickname.attributes?.nick}</span>
                    <ConfirmActionButton
                      className="icon"
                      name={nickname.id}
                      onConfirm={this._handleDeleteNickname}>
                      <FontAwesomeIcon fixedWidth icon="trash" />
                    </ConfirmActionButton>
                  </li>
                )
              }) ?? null
            }
          </ul>

          <div className={styles.addNicknameFloat}>
            <AddNicknameForm
              disabled={maxNicksReached}
              title={maxNicksReached ? 'You\'ve used all your nicknames' : 'Add new nickname'} />
          </div>
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
      nicknames: withCurrentUserId(selectNicknamesByUserId)(state),
      user: withCurrentUserId(selectUserById)(state),
    }
  }
}





export default UserNicknamesPanel
