// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'





// Component imports
import InfoBubble from '../infoBubble'
import ValidatedFormInput from '../ValidatedFormInput'
import styles from './AddNicknameForm.module.scss'
import { ircNickPattern } from '~/data/RegExpr'
import { connect } from '~/store'
import { selectUserById, withCurrentUserId } from '~/store/selectors'





@connect
class AddNicknameForm extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
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

    await addNickname(user.id, nickname)

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
      nickname,
      submitting,
    } = this.state

    return (
      <form
        className={styles.addNicknameForm}
        onSubmit={this._handleSubmit}>
        <ValidatedFormInput
          className={styles.thinInput}
          disabled={this.props.disabled}
          id="AddNickname"
          label="Nickname"
          name="nickname"
          pattern={ircNickPattern}
          patternMessage="Nickname must start with a letter, contain no spaces, and be between 2-30 characters"
          placeholder="Add a nickname..."
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
          className="green icon"
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
