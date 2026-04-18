import { HttpStatus } from '@fuelrats/web-util/http'
import PropTypes from 'prop-types'

import ApiErrorBox from '~/components/MessageBox/ApiErrorBox'


function getErrorText (error) {
  switch (error.code) {
    case HttpStatus.CONFLICT:
      return 'Nickname already registered.'

    case HttpStatus.NOT_FOUND:
      return 'Nickname not found or no longer exists.'

    case HttpStatus.UNPROCESSABLE_ENTITY:
      return error.detail ?? 'Nickname format is invalid.'

    default:
      return undefined
  }
}

function NicknameErrorBox (props) {
  const { error } = props

  if (!error) {
    return null
  }

  return (<ApiErrorBox error={error} renderError={getErrorText} />)
}

NicknameErrorBox.propTypes = {
  error: PropTypes.object,
}


export default NicknameErrorBox
