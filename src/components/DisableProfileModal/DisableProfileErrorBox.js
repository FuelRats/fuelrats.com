import PropTypes from 'prop-types'

import ApiErrorBox from '~/components/MessageBox/ApiErrorBox'

function getErrorText (error) {
  switch (error.status) {
    case 'unauthorized':
      return 'Invalid Password'

    default:
      return undefined
  }
}

function DisableProfileErrorBox (props) {
  return (<ApiErrorBox {...props} renderError={getErrorText} />)
}

DisableProfileErrorBox.propTypes = {
  error: PropTypes.object,
}





export default DisableProfileErrorBox
