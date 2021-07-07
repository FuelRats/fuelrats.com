import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'

import isPromise from '~/util/isPromise'

import styles from './Switch.module.scss'





function Switch (props) {
  const {
    containerProps,
    className,
    disabled,
    id,
    label,
    onChange,
    ...inputProps
  } = props

  const [loading, setLoading] = useState(false)

  const handleChange = useCallback(async (event) => {
    const result = onChange?.(event)

    if (isPromise(result)) {
      setLoading(true)
      await result
      setLoading(false)
    }
  }, [onChange])

  let icon = 'times'
  if (loading) {
    icon = 'circle'
  } else if (props.checked) {
    icon = 'check'
  }

  return (
    <div>
      <label
        {...containerProps}
        className={[styles.switch, { [styles.checked]: props.checked, [styles.loading]: loading, [styles.disabled]: props.disabled }, className]}
        htmlFor={id}>
        <input
          {...inputProps}
          className={styles.input}
          disabled={loading || disabled}
          id={id}
          type="checkbox"
          onChange={handleChange} />

        <span className={styles.slider} />
        <FontAwesomeIcon
          fixedWidth
          className={[styles.handle]}
          icon={icon} />

        {
          label && (
            <span className={styles.label}>{label}</span>
          )
        }
      </label>
    </div>
  )
}

Switch.propTypes = {
  checked: PropTypes.bool,
  className: PropTypes.string,
  containerProps: PropTypes.object,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.node,
  onChange: PropTypes.func.isRequired,
}





export default Switch
