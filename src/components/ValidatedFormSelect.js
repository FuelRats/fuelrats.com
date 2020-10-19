import PropTypes from 'prop-types'
import React from 'react'





class ValidatedFormSelect extends React.Component {
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
      options,
      renderLabel,
      required,
    } = this.props

    return (
      <fieldset>
        {renderLabel && <label htmlFor={id}>{label}</label>}
        <div className="select-wrapper">
          <select
            autoComplete="country-name"
            {...this.selectProps}
            className={['form-select', { required }, className]}
            onChange={this._handleChange}>
            {!renderLabel && (<option value="">{label}</option>)}
            {
              Object.entries(options).map(([key, text]) => {
                return (
                  <option
                    key={key}
                    value={key}>
                    {text}
                  </option>
                )
              })
            }
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
    onChange: () => {
      return {}
    },
    renderLabel: false,
    required: false,
  }

  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    invalidMessage: PropTypes.string,
    label: PropTypes.string.isRequired,
    name: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.object.isRequired,
    renderLabel: PropTypes.bool,
    required: PropTypes.any,
  }
}




export default ValidatedFormSelect
