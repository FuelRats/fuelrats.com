import PropTypes from 'prop-types'

import { useValidationCallback } from '../InputFieldset'
import PasswordFieldset from '../PasswordFieldset'
import styles from './NewPasswordFieldset.module.scss'





function NewPasswordPlaceholder (props) {
  const {
    onValidate: parentValidate,
    displayName = 'Password',
    ...inputProps
  } = props

  const handleValidate = useValidationCallback(
    (messages) => {
      messages.errors.push('Loading password checker...')
    },
    [],
    parentValidate,
  )

  return (
    <PasswordFieldset
      autoComplete="new-password"
      className={styles.newPasswordInput}
      displayName={displayName}
      minLength={12}
      placeholder="Sup3r-S3cur3-P4ssw0rd"
      {...inputProps}
      onValidate={handleValidate} />
  )
}

NewPasswordPlaceholder.propTypes = {
  displayName: PropTypes.string,
  onValidate: PropTypes.func,
}





export default NewPasswordPlaceholder
