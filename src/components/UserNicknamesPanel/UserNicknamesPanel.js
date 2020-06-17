// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { HttpStatus } from '@fuelrats/web-util/http'
import { isError } from 'flux-standard-action'
import React from 'react'





// Component imports
import { connect } from '~/store'
import {
  selectUserById,
  withCurrentUserId,
  selectNicknamesByUserId,
} from '~/store/selectors'

import AddNicknameForm from '../AddNicknameForm/AddNicknameForm'
import ConfirmActionButton from '../ConfirmActionButton'
import ErrorBox from '../ErrorBox'
import styles from './UserNicknamesPanel.module.scss'





// Component constants
const MAXNICKS = 16 // Maximum IRC Nicknames allowed





@connect
class UserNicknamesPanel extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    error: null,
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
    const response = await this.props.deleteNickname(this.props.user, this.props.nicknames.find((nick) => {
      return nick.id === event.target.name
    }))

    if (isError(response)) {
      const { meta, payload } = response
      let errorMessage = 'Unknown error occured.'

      if (HttpStatus.isClientError(meta.response.status)) {
        errorMessage = payload.errors && payload.errors.length ? payload.errors[0].detail : 'Client communication error'
      }

      if (HttpStatus.isServerError(meta.response.status)) {
        errorMessage = 'Server communication error'
      }

      this.setState({
        error: errorMessage,
      })
      return errorMessage
    }

    return undefined
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      nicknames,
    } = this.props

    const { error } = this.state

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
          {
            error && (
              <ErrorBox className={styles.errorBox}>{error}</ErrorBox>
            )
          }
          <ul>
            {(nickCount <= 0) && (<li className="text-center">{'You do not have any nicknames registered yet.'}</li>)}
            {
              nicknames?.map((nickname) => {
                return (
                  <li key={nickname.id}>
                    <span>{nickname.attributes?.nick}</span>
                    <ConfirmActionButton
                      className="icon"
                      confirmButtonText={`Delete nickname '${nickname.attributes?.nick}'`}
                      confirmSubText=""
                      denyButtonText="Cancel"
                      name={nickname.id}
                      onConfirm={this._handleDeleteNickname}
                      onConfirmText="">
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
