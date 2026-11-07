import PropTypes from 'prop-types'
import { useCallback } from 'react'

import ApiErrorBox from '~/components/MessageBox/ApiErrorBox'
import friendlyApiError from '~/util/friendlyApiError'

import MessageBox from '../MessageBox'





function getErrorText (error, codeSubmitted) {
  return friendlyApiError(error, {
    pointerMessages: {
      '/data/attributes/password': {
        title: 'Invalid Password',
        detail: 'The password you entered is incorrect. Please try again.',
      },
      '/data/attributes/code': codeSubmitted
        ? {
          title: 'Invalid Code',
          detail: 'The code you entered is incorrect or expired. Please try again.',
        }
        : {
          title: 'Two-Factor Code Required',
          detail: 'Enter the 6-digit code from your authenticator app to confirm this change.',
        },
    },
    statusMessages: {
      too_many_requests: {
        title: 'Too Many Attempts',
        detail: 'Too many failed attempts. Please wait 15 minutes before trying again.',
      },
    },
  })
}

function ChangeEmailMessageBox (props) {
  const { result } = props

  const renderError = useCallback((error) => {
    return getErrorText(error, result.codeSubmitted)
  }, [result.codeSubmitted])

  return result.success
    ? (
      <MessageBox type="success">
        {'E-Mail changed! Please login to continue.'}
      </MessageBox>
    )
    : (
      <ApiErrorBox
        error={result.error}
        renderError={renderError} />
    )
}

ChangeEmailMessageBox.propTypes = {
  result: PropTypes.object,
}





export default ChangeEmailMessageBox
