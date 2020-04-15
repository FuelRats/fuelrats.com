// Module imports
import React from 'react'





// Component imports
import {
  passwordPattern,
} from '../data/RegExpr'
import HttpStatus from '../helpers/HttpStatus'
import { connect } from '../store'
import asModal, { ModalContent, ModalFooter } from './Modal'
import PasswordField from './PasswordField'


@asModal({
  className: 'password-change-dialog',
  title: 'Change Password',
})
@connect
class ChangePasswordModal extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    currentPassword: '',
    error: null,
    newPassword: '',
    validity: {
      currentPassword: false,
      newPassword: false,
    },
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

    this.setState((state) => {
      return {
        [name]: value,
        validity: {
          ...state.validity,
          [name]: event.validity.valid,
        },
      }
    })
  }

  _handleSubmit = async (event) => {
    event.preventDefault()

    const {
      currentPassword,
      newPassword,
    } = this.state

    this.setState({ submitting: true })

    const { payload, response } = await this.props.changePassword(currentPassword, newPassword)

    let error = null

    if (HttpStatus.isClientError(response.status)) {
      error = payload.errors && payload.errors.length ? payload.errors[0].detail : 'Client communication error'
    }

    if (HttpStatus.isServerError(response.status)) {
      error = 'Server communication error'
    }

    this.setState({
      error,
      submitting: false,
    })

    if (!error) {
      this.props.onClose()
    }
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      currentPassword,
      error,
      newPassword,
      submitting,
    } = this.state

    return (
      <ModalContent as="form" className="dialog no-pad" onSubmit={this._handleSubmit}>
        {
          error && !submitting && (
            <div className="store-errors">
              <div className="store-error">
                <span className="detail">{error}</span>
              </div>
            </div>
          )
        }

        <fieldset data-name="Current Password">
          <PasswordField
            required
            aria-label="Current Password"
            autoComplete="current-password"
            className="dark"
            disabled={submitting}
            id="currentPassword"
            name="currentPassword"
            placeholder="Current Password"
            value={currentPassword}
            onChange={this._handleChange} />
        </fieldset>

        <fieldset data-name="New Password">
          <PasswordField
            required
            showStrength
            showSuggestions
            aria-label="New Password"
            autoComplete="new-password"
            className="dark"
            disabled={submitting}
            id="newPassword"
            maxLength="42"
            minLength="5"
            name="newPassword"
            pattern={passwordPattern}
            placeholder="New Password"
            value={newPassword}
            onChange={this._handleChange} />
        </fieldset>

        <ModalFooter>
          <div className="secondary" />
          <div className="primary">
            <button
              className="green"
              disabled={!this.isValid || submitting}
              type="submit">
              {submitting ? 'Submitting...' : 'Change Password'}
            </button>
          </div>
        </ModalFooter>
      </ModalContent>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get isValid () {
    const {
      currentPassword,
      newPassword,
    } = this.state.validity

    return (currentPassword && newPassword)
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['changePassword']
}





export default ChangePasswordModal
