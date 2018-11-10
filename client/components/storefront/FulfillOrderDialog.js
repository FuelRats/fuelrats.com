// Module imports
import React from 'react'
import PropTypes from 'prop-types'




// Component imports
import { connect } from '../../store'
import Dialog from '../Dialog'
import Component from '../Component'
import ValidatedFormInput from '../ValidatedFormInput'





// Component constants
const INVALID_CARRIER = 'Carrier is Required'


@connect
class CartUpdateDialog extends Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    carrier: 'Royal Mail',
    trackingNumber: '',
    submitting: false,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleSubmit = async () => {
    const {
      onClose,
      orderId,
    } = this.props

    const {
      carrier,
      trackingNumber,
    } = this.state

    this.setState({ submitting: true })

    const { status } = await this.props.updateOrder(orderId, {
      status: 'fulfilled',
      ...(carrier && trackingNumber
        ? {
          shipping: {
            carrier,
            tracking_number: trackingNumber, /* eslint-disable-line camelcase */// Required By API
          },
        }
        : {}),
    })

    if (status === 'success') {
      onClose()
    } else {
      this.setState({
        error: 'Looks like something went wrong. Contact the techs',
        submitting: false,
      })
    }
  }

  _handleChange = ({ target }) => {
    const {
      name,
      value,
    } = target

    this.setState({
      [name]: value,
    })
  }


  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      onClose,
    } = this.props

    const {
      error,
      carrier,
      trackingNumber,
    } = this.state

    return (
      <Dialog
        className="cart-update-dialog"
        controls={this.controls}
        title="Update Order"
        onClose={onClose}>
        <div className="center-content">
          {error && !this.props.loggingIn && (
            <div className="store-errors">
              <div className="store-error">
                {error}
              </div>
            </div>
          )}
          <ValidatedFormInput
            id="carrier"
            invalidMessage={INVALID_CARRIER}
            label="Carrier Name"
            name="carrier"
            onChange={this._handleChange}
            required={Boolean(trackingNumber)}
            value={carrier} />
          <ValidatedFormInput
            id="trackingNumber"
            label={`${carrier ? `${carrier} ` : ''}Tracking Number`}
            name="trackingNumber"
            onChange={this._handleChange}
            value={trackingNumber} />
        </div>
      </Dialog>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get controls () {
    return {
      primary: [
        (
          <button
            disabled={!this.isValid}
            key="UpdateButton"
            onClick={this._handleSubmit}
            type="button">
            Update
          </button>
        ),
      ],
    }
  }


  get isValid () {
    const {
      submitting,
      carrier,
      trackingNumber,
    } = this.state

    if (submitting) {
      return false
    }

    if (trackingNumber && !carrier) {
      return false
    }

    return true
  }



  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['updateOrder']





  /***************************************************************************\
    Prop Definitions
  \***************************************************************************/

  static propTypes = {
    orderId: PropTypes.string.isRequired,
  }
}


export default CartUpdateDialog
