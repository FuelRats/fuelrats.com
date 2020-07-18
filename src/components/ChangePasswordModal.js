// Module imports
import { HttpStatus } from '@fuelrats/web-util/http'
import { isError } from 'flux-standard-action'
import React from 'react'
import { createStructuredSelector } from 'reselect'




// Component imports
import {
  passwordPattern,
} from '~/data/RegExpr'
import { connect } from '~/store'
import { selectCurrentUserId } from '~/store/selectors'

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
    password: '',
    error: null,
    newPassword: '',
    validity: {
      password: false,
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
      userId,
    } = this.props

    const {
      password,
      newPassword,
    } = this.state

    this.setState({ submitting: true })

    const response = await this.props.changePassword({
      id: userId,
      password,
      newPassword,
    })

    if (isError(response)) {
      const { meta, payload } = response
      let errorMessage = 'Unknown error occurred.'

      if (HttpStatus.isClientError(meta.response.status)) {
        errorMessage = payload.errors && payload.errors.length ? payload.errors[0].detail : 'Client communication error'
      }

      if (HttpStatus.isServerError(meta.response.status)) {
        errorMessage = 'Server communication error'
      }

      this.setState({
        error: errorMessage,
        submitting: false,
      })
    } else {
      this.props.onClose()
    }
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      password,
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
            id="password"
            name="password"
            placeholder="Current Password"
            value={password}
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
      password,
      newPassword,
    } = this.state.validity

    return (password && newPassword)
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['changePassword']

  static mapStateToProps = createStructuredSelector({
    userId: selectCurrentUserId,
  })
}





export default ChangePasswordModal
