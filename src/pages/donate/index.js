import DonationForm from '~/components/Forms/DonationForm/DonationForm'


const STRIPE_PORTAL_URL = 'https://billing.stripe.com/p/login/4gM00i10D6nr3tt8umcQU00'


function Donate () {
  return (
    <div className="page-content">
      <div className="intro-text">
        {'Thank you for considering a donation to The Fuel Rats. As simple as our jobs are, we have a lot of systems in place to help us do our rescues, '}
        {'and the servers they run on amount to over €100 per month. We have rats who have fronted the money to keep us running, '}
        {'but if you\'d like to contribute, that would be great!'}
        <br />
        {'Donations are processed via stripe. Any questions may be directed to '}
        <a href="mailto:support@fuelrats.com">{'support@fuelrats.com'}</a>
      </div>
      <DonationForm />
      <div className="panel">
        <header>{'Manage Donations'}</header>
        <div style={{ padding: '1rem' }}>
          <p>{'Have an existing monthly donation? Manage your subscription, update payment details, or cancel.'}</p>
          <a className="button" href={STRIPE_PORTAL_URL} rel="noopener noreferrer" target="_blank">
            {'Manage Subscription'}
          </a>
        </div>
      </div>
    </div>
  )
}

Donate.getPageMeta = () => {
  return {
    title: 'Donate',
    description: 'Support the Fuel Rats\' mission to aid pilots in our vast universe! Your generous donation helps us continue our in-game rescue services.',
  }
}



export default Donate
