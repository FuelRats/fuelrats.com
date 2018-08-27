// Component imports
import { Link } from '../routes'
import Page from '../components/Page'





// Component constants
const title = 'I Need Fuel'





const INeedFuel = () => (
  <div className="page-wrapper">
    <header className="page-header">
      <h1>{title}</h1>
    </header>

    <div className="page-content">
      <div>
        <img
          alt="Fuel rat riding a limpet"
          className="pull-right"
          src="https://i1.wp.com/www.fuelrats.com/wp-content/uploads/2016/07/vig_rescue_250-200x126.jpg?resize=200%2C126&ssl=1" />

        <h5>
          DO YOU SEE A BLUE COUNTDOWN TIMER?
          <br />
          If so, quit to the main menu of the game immediately!
        </h5>

        <br />

        <p>Have you found yourself low on fuel and unable to make it to your nearest refuel point? Never fear! The Fuel Rats are here to help! </p>

        <div className="buttons">
          <a
            className="button call-to-action green"
            href="https://clients.fuelrats.com:7778/"
            rel="noopener noreferrer"
            target="_blank">
            Click here to get refueled!
          </a>

          <br />

          <p>Don't need a fill up? Just looking to chat, or perhaps even help the cause?</p>

          <a
            className="button secondary"
            href="https://kiwi.fuelrats.com/"
            rel="noopener noreferrer"
            target="_blank">
            Click here to chat with the rats!
          </a>
        </div>

        <br />

        <small>By connecting to our IRC and using our services, you agree to our <Link route="legal terms"><a>Terms of Service</a></Link> and <Link route="legal privacy"><a>Privacy Policy</a></Link>.</small>
      </div>
    </div>
  </div>
)





export default Page(title, false)(INeedFuel)
