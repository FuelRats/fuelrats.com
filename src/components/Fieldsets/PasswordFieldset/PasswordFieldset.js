import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import { useReducer, useRef } from 'react'

import IrnputFieldset from '../InputFieldset'
import styles from './PasswordFieldset.module.scss'





function PasswordFieldset (props) {
  const {
    children,
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
    <IrnputFieldset
      ref={inputRef}
      className={styles.passwordInput}
      displayName={displayName}
      placeholder="Sup3r-S3cur3-P4ssw0rd"
      {...inputProps}
      type={showPassword ? 'text' : 'password'}
      onValidate={onValidate}>

      {children}

      <button className={styles.showButton} disabled={inputProps.disabled} tabIndex="-1" type="button" onClick={handlePasswordVisibility}>
        <FontAwesomeIcon fixedWidth icon={showPassword ? 'eye-slash' : 'eye'} />
      </button>

    </IrnputFieldset>
  )
}

PasswordFieldset.propTypes = {
  children: PropTypes.node,
  displayName: PropTypes.string,
  onValidate: PropTypes.func,
}





export default PasswordFieldset
