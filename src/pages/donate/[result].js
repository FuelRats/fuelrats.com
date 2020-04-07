// Module imports
import React from 'react'





// Component imports
import BrandSvg from '../../components/svg/BrandSvg'





function DonateResult () {
  return (
    <div className="page-content">
      <h5 className="intro-text">
        <BrandSvg className="brand-logo" />
        {'Hey! Thanks for donating to The Fuel Rats. Your contribution goes a long way towards keeping us running 24/7.'}
        <br />
        {'Any questions may be directed to '}
        <a href="mailto:support@fuelrats.com">{'support@fuelrats.com'}</a>
      </h5>
    </div>
  )
}





DonateResult.getPageMeta = () => {
  return {
    title: 'Donate',
  }
}





export default DonateResult
