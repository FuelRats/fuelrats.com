// Module imports
import React from 'react'





// Component imports
import ValidatedFormInput from '../ValidatedFormInput'
import ValidatedCountrySelect from '../ValidatedCountrySelect'





// Component Constants
const INVALID_NAME_MESSAGE = 'Name is Required'
const INVALID_EMAIL_MESSAGE = 'Email is Required'
const INVALID_ADDRESS_MESSAGE = 'Address is Required'
const INVALID_CITY_MESSAGE = 'City is Required'
const INVALID_COUNTRY_MESSAGE = 'Country is Required'
const INVALID_ZIP_MESSAGE = 'Postal Code is Required'





class CustomerInfoFields extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    name: '',
    email: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    validity: {
      name: INVALID_NAME_MESSAGE,
      email: INVALID_EMAIL_MESSAGE,
      line1: INVALID_ADDRESS_MESSAGE,
      city: INVALID_CITY_MESSAGE,
      country: INVALID_COUNTRY_MESSAGE,
      postalCode: INVALID_ZIP_MESSAGE,
    },
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleFieldChange = ({ target, valid, message }) => {
    const {
      onChange,
    } = this.props

    this.setState(({ validity }) => {
      const {
        name,
        value,
      } = target
      const required = typeof validity[name] !== 'undefined'

      return {
        [name]: value,
        ...(required
          ? {
            validity: {
              ...validity,
              [name]: valid || message,
            },
          }
          : {}),
      }
    }, () => {
      const {
        city,
        country,
        email,
        line1,
        line2,
        name,
        postalCode,
        state,
      } = this.state

      onChange({
        value: {
          email,
          shipping: {
            name,
            address: {
              line1,
              line2,
              city,
              state,
              postal_code: postalCode, /* eslint-disable-line camelcase */// Required By API
              country,
            },
          },
        },
        valid: this.isValid,
      })
    })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      name,
      email,
      line1,
      line2,
      city,
      state,
      country,
      postalCode,
    } = this.state
    return (
      <>
        <ValidatedFormInput
          autoComplete="shipping name"
          id="name"
          invalidMessage={INVALID_NAME_MESSAGE}
          label="Name"
          name="name"
          onChange={this._handleFieldChange}
          required
          value={name} />
        <ValidatedFormInput
          autoComplete="shipping email"
          id="email"
          invalidMessage={INVALID_EMAIL_MESSAGE}
          label="Email"
          name="email"
          type="email"
          onChange={this._handleFieldChange}
          required
          value={email} />
        <ValidatedFormInput
          autoComplete="shipping address-line1"
          id="line1"
          invalidMessage={INVALID_ADDRESS_MESSAGE}
          label="Address Line 1"
          name="line1"
          onChange={this._handleFieldChange}
          required
          value={line1} />
        <ValidatedFormInput
          autoComplete="shipping address-line2"
          id="line2"
          label="Address Line 2"
          name="line2"
          onChange={this._handleFieldChange}
          value={line2} />
        <div className="form-row">
          <ValidatedFormInput
            autoComplete="shipping address-level2"
            id="city"
            invalidMessage={INVALID_CITY_MESSAGE}
            label="City"
            name="city"
            onChange={this._handleFieldChange}
            required
            value={city} />
          <ValidatedFormInput
            autoComplete="shipping address-level1"
            id="state"
            label="State"
            name="state"
            onChange={this._handleFieldChange}
            value={state} />
        </div>
        <div className="form-row">
          <ValidatedCountrySelect
            autoComplete="shipping country-name"
            id="country"
            invalidMessage={INVALID_COUNTRY_MESSAGE}
            label="Country"
            name="country"
            onChange={this._handleFieldChange}
            required
            value={country} />
          <ValidatedFormInput
            autoComplete="shipping postal-code"
            id="postalCode"
            invalidMessage={INVALID_ZIP_MESSAGE}
            label="Postal Code"
            name="postalCode"
            onChange={this._handleFieldChange}
            required
            value={postalCode} />
        </div>
      </>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get isValid () {
    const invalidStates = Object.values(this.state.validity).filter((value) => value !== true)
    return invalidStates.length ? invalidStates[0] : true
  }
}

export default CustomerInfoFields
