import PropTypes from 'prop-types'
import React from 'react'

import ApiErrorBox from '~/components/MessageBox/ApiErrorBox'

function getErrorText (error) {
  switch (error.status) {
    case 'verification_required':
      if (error.source?.pointer === 'verify') {
        return 'That verification token was incorrect.\nPlease try again.\n'
      }
      return 'It appears you\'re logging in from a new device.\nA verification code has been sent to your email.'
    case 'unauthorized':
      return 'Invalid Username or Password'

    default:
      return undefined
  }
}

function LoginModalErrorBox (props) {
  if (!props.error) {
    return null
  }
  return (<ApiErrorBox {...props} renderError={getErrorText} />)
}

LoginModalErrorBox.propTypes = {
  error: PropTypes.object,
}





export default LoginModalErrorBox
