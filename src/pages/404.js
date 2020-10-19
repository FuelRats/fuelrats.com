import { HttpStatus, HttpStatusText } from '@fuelrats/web-util/http'

import styles from '~/scss/pages/error.module.scss'





const makeStaticErrorPage = (statusCode) => {
  function ErrorPage () {
    return (
      <div className={styles.errorInfo}>
        <h1 className={styles.errorCode}>{statusCode}</h1>
        <h3 className={styles.errorText}>{HttpStatusText[statusCode]}</h3>
        <small className={styles.subtext}>
          {'If you believe this is an error, please contact: '}
          <a href="mailto:support@fuelrats.com">{'support@fuelrats.com'}</a>
        </small>
      </div>
    )
  }

  ErrorPage.getPageMeta = () => {
    return {
      className: styles.errorPage,
      noHeader: true,
      title: HttpStatusText[statusCode],
    }
  }

  return ErrorPage
}





export default makeStaticErrorPage(HttpStatus.NOT_FOUND)

export {
  makeStaticErrorPage,
}
