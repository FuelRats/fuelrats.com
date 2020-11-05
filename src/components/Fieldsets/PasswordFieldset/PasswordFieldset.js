import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import { useReducer, useRef } from 'react'

import InputFieldset from '../InputFieldset'
import styles from './PasswordFieldset.module.scss'





function PasswordFieldset (props) {
  const {
    children,
    className,
    displayName = 'Password',
    onValidate,
    ...inputProps
  } = props

  const inputRef = useRef()

  const [showPassword, handlePasswordVisibility] = useReducer((state) => {
    inputRef.current?.focus()
    return !state
  }, false)

  return (
    <InputFieldset
      ref={inputRef}
      autoComplete="current-password"
      className={[styles.passwordInput, className]}
      displayName={displayName}
      placeholder="Sup3r-S3cur3-P4ssw0rd"
      {...inputProps}
      type={showPassword ? 'text' : 'password'}
      onValidate={onValidate}>

      {children}

      <button className={styles.showButton} disabled={inputProps.disabled} tabIndex="-1" type="button" onClick={handlePasswordVisibility}>
        <FontAwesomeIcon fixedWidth icon={showPassword ? 'eye-slash' : 'eye'} />
      </button>

    </InputFieldset>
  )
}

PasswordFieldset.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  displayName: PropTypes.string,
  onValidate: PropTypes.func,
}





export default PasswordFieldset
