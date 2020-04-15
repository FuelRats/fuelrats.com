// Module imports
import NextError from 'next/error'
import React from 'react'





class ErrorPage extends NextError {
  static getPageMeta () {
    return {
      title: 'error-page',
      noHeader: true,
    }
  }

  render () {
    return (
      <div className="page-content">
        {super.render()}
      </div>
    )
  }
}





export default ErrorPage
