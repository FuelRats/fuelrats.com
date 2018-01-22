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
            errorMessages.push(<span key={`message_${errorMessages.length}`}>{message}</span>)
          }
          break
        case 'number':
          if (error.primaryError.status === condition) {
            errorMessages.push(<span key={`message_${errorMessages.length}`}>{message}</span>)
          }
          break
        default:
          break
      }
    }
  }

  if (errorMessages.length < 1) {
    const errorIdString = error.errors.map(err => err.id).join(', ')
    const invalidFieldString = error.invalidFields.join(', ')

    return (
      <div>
        <span>There was an error while processing your request. Please relay the information below to your closest techrat.</span>
        <p>Error: {error.message} | ErrorIds: {errorIdString} | Sources: {invalidFieldString}.</p>
      </div>
    )
  }

  return errorMessages
}





export default (props) => {
  const {
    error,
    messages,
  } = props

  const errorMessage = getErrorMessages(error, messages)

  return (
    <div className="store-error">
      {errorMessage}
    </div>
  )
}
