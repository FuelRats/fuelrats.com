// Module imports
import React from 'react'





// Component imports
import { connect } from '../store'
import { selectUserDisplayRat } from '../store/selectors'
import Dialog from './Dialog'




const FirstLoginDialog = (props) => (
  <Dialog
    className="first-login-dialog"
    title={`Welcome to the Fuel Rats, CMDR ${props.displayRat.attributes.name}!`}
    onClose={props.onClose}>
    <div className="flex column justify-center align-text">
      <p>
        <br />
        Your name might be on the roster, but there is much more to being a fuel rat.
        <br />
        <br />
        The information and guides in the link below will help you along your way. Good luck, and fly safe CMDR!
        <br />
        <br />
      </p>
      <a className="button" target="_blank" rel="noopener noreferrer" href="https://t.fuelr.at/join">New Rat Documentation</a>
      <br />
    </div>
  </Dialog>
)


FirstLoginDialog.mapStateToProps = (state) => ({
  displayRat: selectUserDisplayRat(state),
})


export default connect(FirstLoginDialog)
