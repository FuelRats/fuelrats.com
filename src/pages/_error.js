// Module imports
import NextError from 'next/error'
import React from 'react'
import { HttpStatusText } from '~/helpers/HttpStatus'
import styles from '~/scss/pages/error.module.scss'





class ErrorPage extends React.Component {
  static getPageMeta (_, props = {}) {
    return {
      className: styles.errorPage,
      noHeader: true,
      title: props.title ?? 'Unexpected Error',
    }
  }

  static getInitialProps (ctx) {
    const initialProps = NextError.getInitialProps(ctx)

    if (typeof initialProps.statusCode === 'number') {
      initialProps.title = HttpStatusText[initialProps.statusCode] ?? 'An unexpected error has occured.'
    }

    return initialProps
  }

  render () {
    const {
      statusCode,
      title,
    } = this.props

    return (
      <div className={styles.errorInfo}>
        {
          Boolean(statusCode) && (
            <h1 className={styles.errorCode}>{statusCode}</h1>
          )
        }

        <h3 className={styles.errorText}>{title}</h3>

        <small className={styles.subtext}>
          {'If you believe this is an error, please open a ticket or contact: '}
          <a href="mailto:support@fuelrats.com">{'support@fuelrats.com'}</a>
        </small>
      </div>
    )
  }
}





export default ErrorPage
