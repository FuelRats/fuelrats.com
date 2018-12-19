// Module imports
import React from 'react'





// Component imports
import { connect } from '../store'
import Dialog from './Dialog'





const FirstLoginDialog = (props) => (
  <Dialog
    className="first-login-dialog"
    title={`Welcome to the Fuel Rats, CMDR ${props.cmdrName}!`}
    onClose={props.onClose}>
    <div className="center-content ">
      <p>
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


FirstLoginDialog.mapStateToProps = ({ user, rats }) => {
  let cmdrName = null

  if (user && user.attributes) {
    let ratId = null
    if (user.attributes.displayRatId) {
      ratId = user.attributes.displayRatId
    } else if (user.relationships.rats.data.length > 0) {
      ratId = user.relationships.rats.data[0].id
    }

    if (ratId) {
      const cmdr = rats.rats[ratId]
      if (cmdr) {
        cmdrName = cmdr.attributes.name
      }
    }
  }


  return {
    cmdrName,
  }
}


export default connect(FirstLoginDialog)
