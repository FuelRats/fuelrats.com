import { HttpStatus } from '@fuelrats/web-util/http'
import PropTypes from 'prop-types'

import ApiErrorBox from '~/components/MessageBox/ApiErrorBox'





const renderError = (error) => {
  switch (error.code) {
    case HttpStatus.UNAUTHORIZED:
      return 'You have been restricted from this service due to suspected fraud.'

    default:
      return error.detail
  }
}





function RegistrationErrorBox (props) {
  const { error } = props

  if (!error) {
    return null
  }

  return (
    <ApiErrorBox
      error={error}
      footer={
        error.code === HttpStatus.UNAUTHORIZED
          ? (
            <>
              {'If you believe this is an error, Please appeal via email: '}
              <a href="mailto:ops@fuelrats.com">{'ops@fuelrats.com'}</a>
            </>
          )
          : (
            <>
              {'If the problem persists, please contact a techrat via email: '}
              <a href="mailto:support@fuelrats.com">{'support@fuelrats.com'}</a>
            </>
          )
      }
      renderError={renderError} />
  )
}

RegistrationErrorBox.propTypes = {
  error: PropTypes.object,
}





export default RegistrationErrorBox
