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
    const {
      statusCode,
      title,
    } = this.props

    return (
      <div className={styles.container}>
        <div className={[styles.postit, styles.topLeft]}>
          <p className={styles.note}>
            <strong>{`Mary,  ${title}`}</strong>
            {'Mary, Mary, quite contrary, How does your garden grow? With silver bells, and cockle shells, And pretty maids all in a row.'}
          </p>
        </div>
        <div className={styles.topRight}>
          <p className={styles.note}>
            <strong>{'Mary, Mary'}</strong>
            {'Mary, Mary, quite contrary, How does your garden grow? With silver bells, and cockle shells, And pretty maids all in a row.'}
          </p>
        </div>
        <div className={styles.btmRight}>
          <p className={styles.note}>
            <strong>{'Mary, Mary'}</strong>
            {'Mary, Mary, quite contrary, How does your garden grow? With silver bells, and cockle shells, And pretty maids all in a row.'}
          </p>
        </div>
        <div className={styles.sidePolo}>
          <div className={styles.polaroidImg}>
            <div className={styles.gloss} />
            <img alt="error_image" src="/static/images/errorpage/side-image.png" />
          </div>
          <p>
            {'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
          </p>
        </div>
        <div className={styles.errorPolo}>
          <div className={styles.polaroidImg}>
            <div className={styles.gloss} />
            <img alt="error_image" src="/static/images/errorpage/404error.jpg" />
          </div>
          {
            Boolean(statusCode) && (
              <p className={styles.errorCode}>{statusCode}</p>
            )
          }
        </div>
      </div>
    )
  }
}





export default ErrorPage
