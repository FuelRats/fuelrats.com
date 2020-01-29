// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'





// Component imports
import { ircNickPattern } from '../data/RegExpr'
import { connect } from '../store'
import { selectUserById, withCurrentUserId } from '../store/selectors'
import InfoBubble from './InfoBubble'
import ValidatedFormInput from './ValidatedFormInput'





@connect
class AddNicknameForm extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    nickname: '',
    password: '',
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
      password,
    } = this.state

    event.preventDefault()

    this.setState({ submitting: true })

    await addNickname(user.id, nickname, password)

    this.setState({
      nickname: '',
      password: '',
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
      password,
      submitting,
    } = this.state

    return (
      <form
        className="add-nickname-form"
        onSubmit={this._handleSubmit}>
        <ValidatedFormInput
          className="dark"
          id="AddNickname"
          label="Nickname"
          name="nickname"
          onChange={this._handleChange}
          placeholder="Add a nickname..."
          pattern={ircNickPattern}
          patternMessage="Nickname must start with a letter, contain no spaces, and be between 2-30 characters"
          type="text"
          value={nickname}>
          <InfoBubble id="NickRegisterReminder" header="reminder">
            {"You cannot register a nick that's in use on IRC. Switch to a temporary one before registering!"}
          </InfoBubble>
        </ValidatedFormInput>



        <ValidatedFormInput
          className="dark"
          id="AddNicknamePass"
          label="NicknamePass"
          name="password"
          onChange={this._handleChange}
          placeholder="IRC Password"
          title="This is the password you use to identify with in IRC"
          type="password"
          value={password} />

        <button
          aria-label="submit new nickname"
          className="green icon"
          disabled={!nickname || !password || submitting}
          type="submit">
          <FontAwesomeIcon icon="check" fixedWidth />
        </button>
      </form>
    )
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['addNickname']

  static mapStateToProps = (state) => ({
    user: withCurrentUserId(selectUserById)(state),
  })
}





export default AddNicknameForm
