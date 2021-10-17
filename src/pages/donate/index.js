import { withStripe } from '~/components/AppLayout'
import DonationForm from '~/components/Forms/DonationForm/DonationForm'





function Donate ({ stripe }) {
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
      <DonationForm stripe={stripe} />
    </div>
  )
}

Donate.getPageMeta = () => {
  return {
    title: 'Donate',
  }
}





export default withStripe(Donate)
