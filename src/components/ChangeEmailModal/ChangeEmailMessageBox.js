import PropTypes from 'prop-types'

import ApiErrorBox from '~/components/MessageBox/ApiErrorBox'

import MessageBox from '../MessageBox'





function getErrorText (error) {
  switch (error.status) {
    default:
      return undefined
  }
}

function ChangeEmailMessageBox (props) {
  const { result } = props

  return result.success
    ? (
      <MessageBox type="success">
        {'E-Mail changed! Please login to continue.'}
      </MessageBox>
    )
    : (
      <ApiErrorBox
        error={result.error}
        renderError={getErrorText} />
    )
}

ChangeEmailMessageBox.propTypes = {
  result: PropTypes.object,
}





export default ChangeEmailMessageBox
