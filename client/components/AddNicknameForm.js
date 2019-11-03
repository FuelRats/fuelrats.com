// Module imports
import React from 'react'





// Component imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from '../store'
import { selectUser, withCurrentUser } from '../store/selectors'
import { ircNickPattern } from '../data/RegExpr'
import Component from './Component'
import ValidatedFormInput from './ValidatedFormInput'





@connect
class AddNicknameForm extends Component {
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
        onSubmit={this._handleSubmit}>
        <ValidatedFormInput
          className="dark"
          id="addNickname"
          label="Nickname"
          name="nickname"
          onChange={this._handleChange}
          placeholder="Add a nickname..."
          pattern={ircNickPattern}
          patternMessage="Nickname must start with a letter, contain no spaces, and be between 2-30 characters"
          type="text"
          value={nickname} />
        <ValidatedFormInput
          className="dark"
          id="addNicknamePass"
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
    user: withCurrentUser(selectUser)(state),
  })
}





export default AddNicknameForm
