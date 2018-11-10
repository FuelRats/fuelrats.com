// Module imports
import React from 'react'





// Component imports
import { connect } from '../store'
import Component from './Component'
import PasswordField from './PasswordField'




@connect
class ChangePasswordForm extends Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    currentPassword: '',
    newPassword: '',
    submitting: false,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleChange = (event) => {
    const {
      name,
      value,
    } = event.target

    this.setState({
      [name]: value,
    })
  }

  _handleSubmit = async (event) => {
    event.preventDefault()

    const {
      currentPassword,
      newPassword,
    } = this.state

    this.setState({ submitting: true })

    await this.props.changePassword(currentPassword, newPassword)

    this.setState({ submitting: false })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      currentPassword,
      newPassword,
      submitting,
    } = this.state

    return (
      <form onSubmit={this._handleSubmit}>
        <header>
          <h3>Change Password</h3>
        </header>

        <fieldset data-name="Current Password">
          <label htmlFor="currentPassword">
            Current Password
          </label>

          <PasswordField
            id="currentPassword"
            name="currentPassword"
            onChange={this._handleChange}
            ref={(_currentPasswordEl) => {
              this._currentPasswordEl = _currentPasswordEl
            }}
            value={currentPassword} />
        </fieldset>

        <fieldset data-name="New Password">
          <label htmlFor="newPassword">
            New Password
          </label>

          <PasswordField
            id="newPassword"
            name="newPassword"
            onChange={this._handleChange}
            ref={(_newPasswordEl) => {
              this._newPasswordEl = _newPasswordEl
            }}
            showStrength
            showSuggestions
            value={newPassword} />
        </fieldset>

        <menu type="toolbar">
          <div className="primary">
            <button
              disabled={!this.isValid || submitting}
              type="submit">
              {submitting ? 'Submitting...' : 'Change Password'}
            </button>
          </div>

          <div className="secondary" />
        </menu>
      </form>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get isValid () {
    if (!this._currentPasswordEl || !this._newPasswordEl) {
      return false
    }

    if (!this._currentPasswordEl.validity.valid) {
      return false
    }

    if (!this._newPasswordEl.validity.valid) {
      return false
    }

    return true
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['changePassword']
}





export default ChangePasswordForm
