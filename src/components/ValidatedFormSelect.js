import clsx from 'clsx'
import PropTypes from 'prop-types'
import { useCallback } from 'react'




function ValidatedFormSelect (props) {
  const {
    className,
    id,
    invalidMessage = null,
    label,
    onChange = () => {
      return {}
    },
    options,
    renderLabel = false,
    required = false,
    ...selectPassthrough
  } = props

  const handleChange = useCallback(({ target }) => {
    let valid = true
    let message = null

    if (required && target.value === '') {
      valid = false
      message = invalidMessage || `${label} is Required`
    }

    onChange({ target, valid, message })
  }, [required, invalidMessage, label, onChange])

  const selectProps = {
    ...selectPassthrough,
    id,
    required,
    name: selectPassthrough.name ?? id,
  }

  return (
    <fieldset>
      {renderLabel && <label htmlFor={id}>{label}</label>}
      <div className="select-wrapper">
        <select
          autoComplete="country-name"
          {...selectProps}
          className={clsx('form-select', { required }, className)}
          onChange={handleChange}>
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

ValidatedFormSelect.propTypes = {
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




export default ValidatedFormSelect
