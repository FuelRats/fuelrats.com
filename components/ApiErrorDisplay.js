// Module imports
import React from 'react'





function getErrorMessages (error, messages) {
  if (!error) {
    return null
  }

  if (!error.isApiError) {
    return (<span>Unknown error occured. Please contact your local Techrats.</span>)
  }

  const errorMessages = []

  if (messages) {
    for (const [condition, message] of messages) {
      switch (typeof condition) {
        case 'string':
          if (error.invalidFields.indexOf(condition) > -1) {
            errorMessages.push(<p key={`message_${errorMessages.length}`}>{message}</p>)
          }
          break
        case 'number':
          if (error.primaryError.status === condition) {
            errorMessages.push(<p key={`message_${errorMessages.length}`}>{message}</p>)
          }
          break
        default:
          break
      }
    }
  }

  if (errorMessages.length < 1) {
    const errorIdString = error.errors.map(err => (err || {}).id).join(', ')
    const invalidFieldString = error.invalidFields.join(', ')

    return (
      <div>
        <p>There was an error while processing your request. Please relay the information below to your closest Techrat.</p>
        <p>Error: {error.message} | ErrorIds: {errorIdString} | Sources: {invalidFieldString}.</p>
      </div>
    )
  }

  return errorMessages
}





export default (props) => {
  const {
    messages,
  } = props

  let errors = props.error

  if (!Array.isArray(errors)) {
    errors = [errors]
  }

  return (
    <div className="store-errors">
      {
        errors.map(error => (
          <div key={error.toString()} className="store-error">
            {getErrorMessages(error, messages)}
          </div>
        ))
      }
    </div>
  )
}
