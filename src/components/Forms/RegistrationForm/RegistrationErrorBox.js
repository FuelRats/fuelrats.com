import { HttpStatus } from '@fuelrats/web-util/http'
import PropTypes from 'prop-types'
import React from 'react'

import ApiErrorBox from '~/components/MessageBox/ApiErrorBox'





function getErrorText (error) {
  switch (error.code) {
    case HttpStatus.CONFLICT:
      switch (error.source?.pointer) {
        case '/data/attributes/name':
          return 'The CMDR name you provided already exists in our database for the given platform.'

        case '/data/attributes/nickname':
          return 'The nickname you provided already exists in our database.'

        case '/data/attributes/email':
          return 'The email you provided already exists in our database.'

        default:
          return undefined
      }

    case HttpStatus.UNPROCESSABLE_ENTITY:
      return 'Somehow, you managed to send an invalid platform.\n Quit fooling around!'

    default:
      return undefined
  }
}

function RegistrationErrorBox (props) {
  const {
    error,
  } = props

  if (!error) {
    return null
  }

  return (
    <>
      <br />
      <ApiErrorBox error={error} renderError={getErrorText} />
    </>
  )
}

RegistrationErrorBox.propTypes = {
  error: PropTypes.object,
}





export default RegistrationErrorBox
