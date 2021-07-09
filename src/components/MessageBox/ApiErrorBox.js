import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { isValidElementType } from 'react-is'

import MessageBox from './MessageBox'





function ApiErrorBox (props) {
  const {
    error: rawError,
    renderError,
    ...messageProps
  } = props

  const error = useMemo(
    () => {
      if (!rawError) {
        return undefined
      }

      const renderedError = renderError?.(rawError)

      if (isValidElementType(renderedError)) {
        // If rendered error is a valid renderable element, use it as the error detail with the base error's title.
        // This includes all strings, functions, class components, and other react-specific objects.
        // If a function is encountered here we also need to call it as a component.
        return {
          title: rawError.title,
          detail: typeof renderedError === 'function'
            ? (<renderedError />)
            : renderedError,
        }
      }

      // Ensure return is never null here so we render the error box itself, even if the render function returned null.
      return renderedError ?? { title: rawError.title }
    },
    [
      renderError,
      rawError,
    ],
  )

  if (!error || error.ignore) {
    return null
  }

  return (
    <MessageBox title={error.title} {...messageProps}>
      {
        error.detail ?? (
          <>
            {'An unknown error occurred while processing your request. \n Please contact us at '}
            <a href="mailto:support@fuelrats.com">{'support@fuelrats.com'}</a>
            {
              rawError.id && (
                <>
                  {', and include this error information in your email: \n'}
                  <pre>
                    {`"id": "${rawError.id}",\n`}
                    {`"error": "${rawError.status}",\n`}
                    {`"source": ${JSON.stringify(rawError.source, undefined, 2)}`}
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
