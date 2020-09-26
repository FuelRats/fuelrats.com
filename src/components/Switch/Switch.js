import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import React from 'react'

import styles from './Switch.module.scss'





function Switch (props) {
  const {
    containerProps,
    className,
    id,
    label,
    ...inputProps
  } = props



  return (
    <div>
      <label {...containerProps} className={[styles.switch, { [styles.checked]: props.checked, [styles.disabled]: props.disabled }, className]} htmlFor={id}>
        <input
          {...inputProps}
          className={styles.input}
          id={id}
          type="checkbox" />

        <span className={styles.slider} />
        <FontAwesomeIcon fixedWidth className={styles.handle} icon={props.checked ? 'check' : 'times'} />

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
}





export default Switch
