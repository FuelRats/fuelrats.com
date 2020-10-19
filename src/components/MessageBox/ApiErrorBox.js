import PropTypes from 'prop-types'

import MessageBox from './MessageBox'





function ApiErrorBox (props) {
  const {
    error,
    renderError,
    ...messageProps
  } = props

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
                  {', and include this error ID in your email: \n'}
                  <code>{error.id}</code>
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
  error: PropTypes.object.isRequired,
  renderError: PropTypes.func,
}





export default ApiErrorBox
