// Module imports
import React from 'react'
import PropTypes from 'prop-types'




// Component imports
import { connect } from '../../store'
import Dialog from '../Dialog'
import Component from '../Component'
import ValidatedFormInput from '../ValidatedFormInput'





// Component constants
const INVALID_TRACKING_NUMBER = 'Tracking Number is Required'



@connect
class CartUpdateDialog extends Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
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
      trackingNumber,
    } = this.state

    this.setState({ submitting: true })

    const { status } = await this.props.updateOrder(orderId, {
      status: 'fulfilled',
      shipping: {
        carrier: 'Royal Mail',
        tracking_number: trackingNumber,
      },
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
            id="trackingNumber"
            invalidMessage={INVALID_TRACKING_NUMBER}
            label="Royal Mail Tracking Number"
            name="trackingNumber"
            onChange={this._handleChange}
            required
            value={trackingNumber} />
        </div>
      </Dialog>
    )
  }





  /***************************************************************************\
    getters
  \***************************************************************************/

  get controls () {
    return {
      primary: [
        (
          <button
            disabled={!this.isValid}
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
      trackingNumber,
    } = this.state

    if (submitting || !trackingNumber.length) {
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
