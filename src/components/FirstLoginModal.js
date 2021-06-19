import asModal, { ModalContent, ModalFooter } from './asModal'





function FirstLoginModal () {
  return (
    <>
      <ModalContent className="flex column justify-center align-text">
        <p>
          {'Your name might be on the roster, but there is much more to being a Fuel Rat.'}
          <br />
          {'The information and guides in the link below will help you along your way. Good luck, and fly safe CMDR!'}
        </p>
      </ModalContent>
      <ModalFooter>
        <div className="primary">
          <a className="button" href="https://t.fuelr.at/join" rel="noopener noreferrer" target="_blank">{'New Rat Documentation'}</a>
        </div>
      </ModalFooter>
    </>
  )
}





export default asModal({
  className: 'first-login-dialog',
  title: 'Welcome to The Fuel Rats!',
})(FirstLoginModal)
