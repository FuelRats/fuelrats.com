import BrandSvg from '../../../public/static/svg/brand.svg'





function DonateResult ({ query }) {
  const succeeded = query.result === 'success'

  return (
    <div className="page-content">
      <h5 className="intro-text">
        <BrandSvg className="brand-logo" />
        {
          succeeded
            ? 'Hey! Thanks for donating to The Fuel Rats. Your contribution goes a long way towards keeping us running 24/7.'
            : 'Your donation was not completed. No charge has been made. If this was a mistake, feel free to try again.'
        }
        <br />
        {'Any questions may be directed to '}
        <a href="mailto:support@fuelrats.com">{'support@fuelrats.com'}</a>
      </h5>
    </div>
  )
}

DonateResult.getPageMeta = ({ query }) => {
  return {
    title: query?.result === 'success' ? 'Thanks for Donating' : 'Donation Cancelled',
  }
}





export default DonateResult
