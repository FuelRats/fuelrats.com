// Module imports
import NextError from 'next/error'
import React from 'react'





// Component imports
import PageWrapper from '../components/AppLayout/PageWrapper'





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
