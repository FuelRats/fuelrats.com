// Component imports
import Page from '../components/Page'





// Component constants
const title = 'Donate'





const Donate = () => (
  <div className="page-wrapper">
    <header className="page-header">
      <h1>{title}</h1>
    </header>

    <div className="page-content">
      <p>
        The Fuel Rats are an Elite group of pilots who specialize in saving stranded CMDRs from the pitch black abyss of space.
        <br />
        Since 3301, We've built up a plethora of custom tools and services to assist in meeting our ever-growing demand.
        <br />
        With growth has come expenses. The cost to keep our lights on has grown significantly, and now exceed €100 per month.
        <br />
        To assist the dedicated few who have been helping with these costs privately, we have now opened donations to the general public!
      </p>

      <p>
        If you would like to contribute, click the button below to be taken to our donation processing page.
        <br />
        Your donation will be used to directly pay for the servers which run our websites, irc, and other related services which keep us servicing the Elite: Dangerous Community.
        <br />
        For questions, comments, or concerns please contact support@fuelrats.com, or <a href="http://t.fuelr.at/help">open a helpdesk ticket</a>
      </p>
      <menu>
        <a className="button" href="https://donate.fuelrats.com/donate.php">Donate Now</a>
      </menu>

      <br />
    </div>
  </div>
)





export default Page(Donate, title)
