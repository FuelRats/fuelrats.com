import PropTypes from 'prop-types'

import ApiErrorBox from '~/components/MessageBox/ApiErrorBox'

import MessageBox from '../MessageBox'


function getErrorText (error) {
  switch (error.status) {
    case 'unauthorized':
      return 'Invalid User'
    case 'toobig':
      return 'Avatar is too large; please try on a reduced size image'
    case 'internal':
      return 'An internal error occured'
    default:
      return undefined
  }
}

function UploadAvatarMessageBox (props) {
  const { result } = props

  return result.success
    ? (
      <MessageBox type="success">
        {'Avatar Updated!'}
      </MessageBox>
    )
    : (
      <ApiErrorBox
        error={result.error}
        renderError={getErrorText} />
    )
}

UploadAvatarMessageBox.propTypes = {
  result: PropTypes.object,
}

export default UploadAvatarMessageBox
