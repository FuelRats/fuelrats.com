import PropTypes from 'prop-types'

import ApiErrorBox from '~/components/MessageBox/ApiErrorBox'

import MessageBox from '../MessageBox'


const PAYLOAD_TOO_LARGE = 413
const AVATAR_TOO_LARGE_TEXT = 'Avatar is too large; please try on a reduced size image'

function getErrorText (error) {
  if (error.code === PAYLOAD_TOO_LARGE || error.status === 'payload_too_large') {
    return AVATAR_TOO_LARGE_TEXT
  }

  switch (error.status) {
    case 'unauthorized':
      return 'Invalid User'
    case 'toobig':
      return AVATAR_TOO_LARGE_TEXT
    case 'internal':
      return 'An internal error occured'
    default:
      return undefined
  }
}

function UploadAvatarMessageBox (props) {
  const { result, className } = props

  return result.success
    ? (
      <MessageBox className={className} title="Success!" type="success">
        {'You avatar has been updated!'}
        <br />
        {'This window will now automatically close...'}
      </MessageBox>
    )
    : (
      <ApiErrorBox
        className={className}
        error={result.error}
        renderError={getErrorText} />
    )
}

UploadAvatarMessageBox.propTypes = {
  className: PropTypes.string,
  result: PropTypes.object.isRequired,
}

export default UploadAvatarMessageBox
