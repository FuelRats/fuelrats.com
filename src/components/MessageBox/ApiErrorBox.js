import PropTypes from 'prop-types'

import MessageBox from './MessageBox'





function ApiErrorBox (props) {
  const {
    error,
    renderError,
    ...messageProps
  } = props

  if (!error) {
    return null
  }

  return (
    <MessageBox {...messageProps}>
      {
        renderError?.(error) ?? (
          <>
            {'An unknown error occurred while processing your request. \n Please contact us at '}
            <a href="mailto:support@fuelrats.com">{'support@fuelrats.com'}</a>
            {
              error.id && (
                <>
                  {', and include this error information in your email: \n'}
                  <pre>
                    {`"id": "${error.id}",\n`}
                    {`"error": "${error.status}",\n`}
                    {`"source": ${JSON.stringify(error.source, undefined, 2)}`}
                  </pre>
                </>
              )
            }
          </>
        )
      }
    </MessageBox>
  )
}

ApiErrorBox.propTypes = {
  error: PropTypes.object,
  renderError: PropTypes.func,
}





export default ApiErrorBox
