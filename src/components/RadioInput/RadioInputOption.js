import PropTypes from 'prop-types'

import styles from './RadioInputOption.module.scss'





function RadioInputOption (props) {
  const {
    as: Element = 'div',
    className,
    label,
    title,
    value,
    ...inputProps
  } = props

  const optionId = `${inputProps.name}-${value}`

  return (
    <Element className={[styles.option, { [styles.disabled]: inputProps.disabled, [styles.checked]: inputProps.checked }, className]}>
      <input
        {...inputProps}
        aria-hidden={false}
        aria-label={label}
        className={styles.optionInput}
        id={optionId}
        type="radio"
        value={value} />
      <label
        className={styles.optionLabel}
        htmlFor={optionId}
        title={title}>
        <span className={styles.optionLabelText}>
          {label}
        </span>
      </label>
    </Element>
  )
}

RadioInputOption.propTypes = {
  as: PropTypes.elementType,
  checked: PropTypes.any,
  className: PropTypes.string,
  disabled: PropTypes.any,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  value: PropTypes.string.isRequired,
}


export default RadioInputOption
