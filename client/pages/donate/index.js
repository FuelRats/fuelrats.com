// Module imports
import React from 'react'



// Component imports
import { PageWrapper, withStripe } from '../../components/AppLayout'
import DonateForm from '../../components/DonateForm'





function Donate (props) {
  const {
    stripe,
  } = props

  return (
    <PageWrapper title="Donate">
      <div className="page-content">
        <div className="intro-text">
          {'Thank you for considering a donation to The Fuel Rats. As simple as our jobs are, we have a lot of systems in place to help us do our rescues, '}
          {'and the servers they run on amount to over €100 per month. We have rats who have fronted the money to keep us running, '}
          {'but if you\'d like to contribute, that would be great!'}
          <br />
          {'Donations are processed via stripe. Any questions may be directed to '}
          <a href="mailto:support@fuelrats.com">{'support@fuelrats.com'}</a>
        </div>
        <DonateForm stripe={stripe} />
      </div>
    </PageWrapper>
  )
}




export default withStripe(Donate)
