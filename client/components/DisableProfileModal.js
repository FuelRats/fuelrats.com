// Module imports
import React from 'react'





// Component imports
import HttpStatus from '../helpers/httpStatus'
import { connect } from '../store'
import asModal, { ModalContent, ModalFooter } from './Modal'
import PasswordField from './PasswordField'


@asModal({
  className: 'disable-profile-dialog',
  title: 'Disable Profile',
})
@connect
class DisableProfileModal extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    password: '',
    error: null,
    validity: {
      password: false,
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

    this.setState((state) => ({
      [name]: value,
      validity: {
        ...state.validity,
        [name]: event.validity.valid,
      },
    }))
  }

  _handleSubmit = async (event) => {
    event.preventDefault()

    const {
      password,
    } = this.state

    this.setState({ submitting: true })

    const { payload, response } = await this.props.disableProfile(password)

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
      password,
      error,
      submitting,
    } = this.state

    return (
      <ModalContent as="form" className="dialog no-pad" onSubmit={this._handleSubmit}>
        {error && !submitting && (
          <div className="store-errors">
            <div className="store-error">
              {error}
            </div>
          </div>
        )}

        <div className="info">
          {'This will hide your profile from public view, but will not delete it from our servers. To re-enable your account, please email '}
          <a href="mailto:support@fuelrats.com">support@fuelrats.com</a>{'.'}
          <br />
          {'You may contact '}
          <a href="mailto:gdpr@fuelrats.com">gdpr@fuelrats.com</a>
          {' to request a copy of all information stored about you, or to request a permanent deletion of all your data.'}
        </div>

        <fieldset data-name="Password">
          <PasswordField
            aria-label="Password"
            autoComplete="password"
            className="dark"
            disabled={submitting}
            id="password"
            name="password"
            onChange={this._handleChange}
            placeholder="Password"
            value={password}
            required />
        </fieldset>

        <ModalFooter>
          <div className="secondary" />
          <div className="primary">
            <button
              disabled={!this.isValid || submitting}
              type="submit">
              {submitting ? 'Submitting...' : 'Disable Profile'}
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
    } = this.state.validity

    return (password)
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['disableProfile']
}





export default DisableProfileModal
