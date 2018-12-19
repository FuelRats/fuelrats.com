// Module imports
import React from 'react'
import PropTypes from 'prop-types'

// Component imports
import countryList from '../data/CountryList'
import classNames from '../helpers/classNames'




class ValidatedCountrySelect extends React.Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleChange = ({ target }) => {
    const {
      invalidMessage,
      label,
      onChange,
      required,
    } = this.props
    const {
      value,
    } = target

    let valid = true
    let message = null

    if (required && value === '') {
      valid = false
      message = invalidMessage || `${label} is Required`
    }

    onChange({
      target,
      valid,
      message,
    })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      className,
      id,
      label,
      renderLabel,
      required,
    } = this.props

    const classes = classNames(
      'country-select',
      ['required', required],
      [className, Boolean(className)],
    )

    return (
      <fieldset>
        {renderLabel && <label htmlFor={id}>{label}</label>}
        <div className="select-wrapper">
          <select
            autoComplete="country-name"
            {...this.selectProps}
            className={classes}
            onChange={this._handleChange}>
            {!renderLabel && (<option value="">{label}</option>)}
            {countryList.map((country) => (
              <option
                key={country}
                value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </fieldset>
    )
  }


  get selectProps () {
    const inputProps = { ...this.props }

    delete inputProps.invalidMessage
    delete inputProps.label
    delete inputProps.renderLabel
    delete inputProps.onChange

    if (!inputProps.name) {
      inputProps.name = inputProps.id
    }

    return inputProps
  }


  static defaultProps = {
    invalidMessage: null,
    name: null,
    onChange: () => ({}),
    renderLabel: false,
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    invalidMessage: PropTypes.string,
    label: PropTypes.string.isRequired,
    name: PropTypes.string,
    onChange: PropTypes.func,
    renderLabel: PropTypes.bool,
  }
}




export default ValidatedCountrySelect
