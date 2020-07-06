// Module imports
import NextError from 'next/error'
import React from 'react'
import { HttpStatusText } from '../helpers/HttpStatus'
import styles from '../scss/pages/error.module.scss'





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
    return (
      <div className={styles.container}>
        <video autoPlay loop muted className={styles.myVideo}>
          <source src="/static/videos/ErrorBGElite.mp4" type="video/mp4" />
        </video>
        <div className={`${styles.error} ${styles.glitchWrapper}`}>
          <header><p className={styles.glitch} data-text="Error 404">{'Error 404'}</p></header>
        </div>
      </div>
    )
  }
}





export default ErrorPage
