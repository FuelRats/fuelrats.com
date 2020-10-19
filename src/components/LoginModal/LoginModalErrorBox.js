import PropTypes from 'prop-types'

import ApiErrorBox from '~/components/MessageBox/ApiErrorBox'

function getErrorText (error) {
  // Bad verification tokens are returned as oauth errors, which is weird but okay.
  if (error.error_description === 'verify') {
    return 'That verification token was incorrect. Please try again.'
  }

  switch (error.status) {
    case 'verification_required':
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
