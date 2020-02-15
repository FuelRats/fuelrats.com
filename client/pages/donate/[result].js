// Module imports
import React from 'react'





// Component imports
import { PageWrapper } from '../../components/AppLayout'
import BrandSvg from '../../components/svg/BrandSvg'





function DonateResult () {
  return (
    <PageWrapper title="Donate">
      <div className="page-content">
        <h5 className="intro-text">
          <BrandSvg className="brand-logo" />
          {'Hey! Thanks for donating to The Fuel Rats. Your contribution goes a long way towards keeping us running 24/7.'}
          <br />
          {'Any questions may be directed to '}
          <a href="mailto:support@fuelrats.com">{'support@fuelrats.com'}</a>
        </h5>
      </div>
    </PageWrapper>
  )
}





export default DonateResult
