import PropTypes from 'prop-types'

import ApiErrorBox from '~/components/MessageBox/ApiErrorBox'

import MessageBox from '../../MessageBox'





function getErrorText (error) {
  switch (error.status) {
    case 'unauthorized':
      return 'Invalid Password'

    default:
      return undefined
  }
}

function ChangePasswordMessageBox (props) {
  const { result } = props

  return result.success
    ? (
      <MessageBox type="success">
        {'Password changed!'}
      </MessageBox>
    )
    : (
      <ApiErrorBox
        error={result.error}
        renderError={getErrorText} />
    )
}

ChangePasswordMessageBox.propTypes = {
  result: PropTypes.object,
}





export default ChangePasswordMessageBox
