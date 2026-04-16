import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ErrorBoundary } from 'react-error-boundary'




function handleReload () {
  window.location.reload()
}


function PageErrorFallback () {
  return (
    <div className="page-content">
      <h2>{'Something broke while rendering this page.'}</h2>
      <p>{'The rest of the site should still work — try navigating elsewhere, or reload to retry.'}</p>
      <button className="compact" type="button" onClick={handleReload}>
        <FontAwesomeIcon fixedWidth icon="arrows-rotate" />
        {' Reload'}
      </button>
    </div>
  )
}


function logPageError (error, info) {
  // eslint-disable-next-line no-console
  console.error('[PageErrorBoundary]', error, info.componentStack)
}


export default function PageErrorBoundary ({ children }) {
  return (
    <ErrorBoundary FallbackComponent={PageErrorFallback} onError={logPageError}>
      {children}
    </ErrorBoundary>
  )
}
