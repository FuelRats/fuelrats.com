import { HttpStatusText } from '@fuelrats/web-util/http'
import NextError from 'next/error'

import styles from '~/scss/pages/error.module.scss'




function ErrorPage ({ message, statusCode, title }) {
  return (
    <div className={styles.errorInfo}>
      {
        Boolean(statusCode) && (
          <h1 className={styles.errorCode}>{statusCode}</h1>
        )
      }

      <h3 className={styles.errorText}>{title}</h3>

      {
        Boolean(message) && (
          <div className={styles.errorMessage}>{message}</div>
        )
      }

      <small className={styles.subtext}>
        {'If you believe this is an error, please open a ticket or contact: '}
        <a href="mailto:support@fuelrats.com">{'support@fuelrats.com'}</a>
      </small>
    </div>
  )
}

ErrorPage.getPageMeta = (_, props = {}) => {
  return {
    className: styles.errorPage,
    noHeader: true,
    title: props.title ?? 'Unexpected Error',
  }
}

ErrorPage.getInitialProps = (ctx) => {
  const initialProps = NextError.getInitialProps(ctx)

  if (typeof initialProps.statusCode === 'number') {
    initialProps.title = HttpStatusText[initialProps.statusCode] ?? 'An unexpected error has occured.'
  }

  return initialProps
}




export default ErrorPage
