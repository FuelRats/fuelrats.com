// Module imports
import { bindActionCreators } from 'redux'
import React from 'react'
import { connect } from 'react-redux'





// Component imports
import { actions } from '../store'
import Component from './Component'
import PasswordField from './PasswordField'





class ChangePasswordForm extends Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (props) {
    super(props)

    this._bindMethods([
      'handleChange',
      'onSubmit',
    ])

    this.state = {
      currentPassword: '',
      newPassword: '',
      submitting: false,
    }
  }

  handleChange (event) {
    const newState = {}
    const {
      name,
      value,
    } = event.target
    const attribute = name

    newState[attribute] = value

    this.setState(newState)
  }

  async onSubmit (event) {
    event.preventDefault()

    const {
      currentPassword,
      newPassword,
    } = this.state

    this.setState({ submitting: true })

    await this.props.changePassword(currentPassword, newPassword)

    this.setState({ submitting: false })
  }

  render () {
    const {
      currentPassword,
      newPassword,
      submitting,
    } = this.state

    return (
      <form onSubmit={this.onSubmit}>
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
            onChange={this.handleChange}
            ref={_currentPasswordEl => this._currentPasswordEl = _currentPasswordEl}
            value={currentPassword} />
        </fieldset>

        <fieldset data-name="New Password">
          <label htmlFor="newPassword">
            New Password
          </label>

          <PasswordField
            id="newPassword"
            name="newPassword"
            onChange={this.handleChange}
            ref={_newPasswordEl => this._newPasswordEl = _newPasswordEl}
            showStrength
            showSuggestions
            value={newPassword} />
        </fieldset>

        <menu type="toolbar">
          <div className="primary">
            <button
              disabled={!this.validate() || submitting}
              type="submit">
              {submitting ? 'Submitting...' : 'Change Password'}
            </button>
          </div>

          <div className="secondary" />
        </menu>
      </form>
    )
  }

  validate () {
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
}





const mapDispatchToProps = dispatch => ({ changePassword: bindActionCreators(actions.changePassword, dispatch) })





export default connect(null, mapDispatchToProps)(ChangePasswordForm)
