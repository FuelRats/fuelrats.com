import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { HttpStatus } from '@fuelrats/web-util/http'
import { isError } from 'flux-standard-action'
import React from 'react'

import InfoBubble from '~/components/InfoBubble'
import ValidatedFormInput from '~/components/ValidatedFormInput'
import { ircNickPattern } from '~/data/RegExpr'
import { connect } from '~/store'
import { selectUserById, withCurrentUserId } from '~/store/selectors'

import styles from './AddNicknameForm.module.scss'





@connect
class AddNicknameForm extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    error: null,
    nickname: '',
    submitting: false,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleSubmit = async (event) => {
    const {
      addNickname,
      user,
    } = this.props
    const {
      nickname,
    } = this.state
    event.preventDefault()

    this.setState({ submitting: true })

    const response = await addNickname(user, { attributes: { nick: nickname } })

    if (isError(response)) {
      const { meta, payload } = response
      let errorMessage = 'Unknown error occured.'

      if (HttpStatus.isClientError(meta.response.status)) {
        errorMessage = payload.errors && payload.errors.length ? payload.errors[0].title : 'Client communication error'
      }

      if (HttpStatus.isServerError(meta.response.status)) {
        errorMessage = 'Server communication error'
      }

      if (meta.response.status === HttpStatus.CONFLICT) {
        errorMessage = 'Nickname already registered'
      }

      if (meta.response.status === HttpStatus.UNPROCESSABLE_ENTITY) {
        errorMessage = 'Nickname invalid'
      }

      this.setState({
        error: errorMessage,
      })
    }

    this.setState({
      nickname: '',
      submitting: false,
    })
  }

  _handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      error,
      nickname,
      submitting,
    } = this.state

    return (
      <form
        className={styles.addNicknameForm}
        onSubmit={this._handleSubmit}>
        <ValidatedFormInput
          className={[styles.thinInput, error && styles.error]}
          disabled={this.props.disabled}
          id="AddNickname"
          label="Nickname"
          name="nickname"
          pattern={ircNickPattern}
          patternMessage="Nickname must start with a letter, contain no spaces, and be between 2-30 characters"
          placeholder={error || 'Add a nickname...'}
          title={this.props.title}
          type="text"
          value={nickname}
          onChange={this._handleChange}>
          <InfoBubble className={styles.nicknamesInfo} header="reminder" id="NickRegisterReminder">
            {"You cannot register a nick that's in use on IRC. Switch to a temporary one before registering!"}
          </InfoBubble>
        </ValidatedFormInput>

        <button
          aria-label="submit new nickname"
          className="green compact"
          disabled={!nickname || submitting}
          type="submit">
          <FontAwesomeIcon fixedWidth icon="check" />
        </button>
      </form>
    )
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['addNickname']

  static mapStateToProps = (state) => {
    return {
      user: withCurrentUserId(selectUserById)(state),
    }
  }
}





export default AddNicknameForm
