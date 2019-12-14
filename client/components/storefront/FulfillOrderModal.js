// Module imports
import React from 'react'
import PropTypes from 'prop-types'




// Component imports
import { connect } from '../../store'
import asModal, { ModalContent, ModalFooter } from '../Modal'
import ValidatedFormInput from '../ValidatedFormInput'





// Component constants
const INVALID_CARRIER = 'Carrier is Required'

@asModal({
  className: 'cart-update-dialog',
  title: 'Update Order',
})
@connect
class FulfillOrderModal extends React.Component {
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
      error,
      carrier,
      trackingNumber,
    } = this.state

    return (
      <>
        <ModalContent className="center">
          {error && !this.props.loggedIn && (
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
        </ModalContent>
        <ModalFooter>
          <div className="secondary" />
          <div className="primary">
            <button
              disabled={!this.isValid}
              key="UpdateButton"
              onClick={this._handleSubmit}
              type="button">
                Update
            </button>
          </div>
        </ModalFooter>
      </>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

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


export default FulfillOrderModal
