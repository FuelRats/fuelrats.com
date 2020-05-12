// Module imports
import React from 'react'





// Component imports
import { HttpStatus } from '../helpers/HttpStatus'
import { connect } from '../store'
import { selectUserById, withCurrentUserId } from '../store/selectors'
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
    userId: this.props.user.id,
    password: '',
    error: null,
    validity: {
      password: false,
    },
    submitting: false,
    confirming: false,
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

  _handleConfirm = () => {
    this.setState((state) => {
      return { confirming: !state.confirming }
    })
  }

  _handleSubmit = async (event) => {
    event.preventDefault()

    const {
      password,
      userId,
    } = this.state

    this.setState({ submitting: true })

    const response = await this.props.updateUser(userId, { status: 'deactivated' }, password)

    let error = null

    if (HttpStatus.isClientError(response.errors.code)) {
      error = response.errors && response.errors.length ? response.errors[0].detail : 'Client communication error'
    }

    if (HttpStatus.isServerError(response.errors.code)) {
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
      confirming,
    } = this.state

    return (
      <ModalContent as="form" className="dialog no-pad" onSubmit={this._handleSubmit}>
        {
          error && !submitting && (
            <div className="store-errors">
              <div className="store-error">
                {error}
              </div>
            </div>
          )
        }

        <div className="info">
          {'This will hide your profile from public view, but will not delete it from our servers. To re-enable your account, please email '}
          <a href="mailto:support@fuelrats.com">{'support@fuelrats.com'}</a>{'.'}
          <br />
          {'You may contact '}
          <a href="mailto:gdpr@fuelrats.com">{'gdpr@fuelrats.com'}</a>
          {' to request a copy of all information stored about you, or to request a permanent deletion of all your data.'}
        </div>

        <fieldset data-name="Password">
          <PasswordField
            required
            aria-label="Password"
            autoComplete="password"
            className="dark"
            disabled={submitting}
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={this._handleChange} />
        </fieldset>

        <ModalFooter>
          <div className="secondary" />
          <div className="primary">
            <div className={{ hidden: !confirming }}>
              {'Are you sure?'}
            </div>
            <button
              className={{ green: confirming, hidden: !confirming }}
              disabled={!this.isValid || submitting}
              type="submit">
              {submitting ? 'Submitting...' : 'Disable Profile'}
            </button>
            <button
              disabled={(!confirming && !this.isValid) || submitting}
              type="button"
              onClick={this._handleConfirm}>
              {confirming ? 'Cancel' : 'Disable Profile'}
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

  static mapDispatchToProps = ['updateUser']
  static mapStateToProps = (state) => {
    return {
      user: withCurrentUserId(selectUserById)(state),
    }
  }
}





export default DisableProfileModal
