// Module imports
import React from 'react'
import NextError from 'next/error'





// Component imports
import PageWrapper from '../components/PageWrapper'





class ErrorPage extends NextError {
  render () {
    return (
      <PageWrapper title="error-page" noHeader>
        <div className="page-content">
          {super.render()}
        </div>
      </PageWrapper>
    )
  }
}





export default ErrorPage
