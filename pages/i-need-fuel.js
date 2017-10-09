// Module imports
import React from 'react'





// Component imports
import Page from '../components/Page'





// Component imports
const title = 'I Need Fuel'





class INeedFuel extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    return (
      <div className="page-wrapper">
        <header className="page-header">
          <h1>{title}</h1>
        </header>

        <div className="page-content">
          <div>
            <img
              className="pull-right"
              src="https://i1.wp.com/www.fuelrats.com/wp-content/uploads/2016/07/vig_rescue_250-200x126.jpg?resize=200%2C126&ssl=1" />

            <p>Click on the left button to activate a chat session. Put your CMDR name (or GamerTag if you play on XBox or PS4), current system and whether you’re on emergency o2 (Blue timer in the top right of your screen) and hit "Start". You’ll be able to see which Fuel Rats are logged in and instantly talk with everyone. If there is a "Dispatch" he/she’ll be the one assigning people to help you.</p>

            <p>If you find yourself stranded, log out to main menu and await further instructions.</p>

            <p>If you’re just checking out the service to say "hello" that’s fine, you can press the green button to open the chat room.</p>

            <p><strong>For a visual reference of these steps along with default controls, refer to these <a href="https://imgur.com/gallery/YuWa6">Emergency Fuel Procedures</a>.</strong></p>

            <p>If you encounter difficulties logging into our IRC chat and need fuel, please make a post on <a href="https://www.reddit.com/r/FuelRats/">the subreddit</a> with the above mentioned information for us to assist you!</p>

            <p>When you join the chat, do not send or accept friend requests in-game until instructed to do so by the dispatcher.</p>

            <p>There are griefers/miscreants that occasionally try to learn the location of stranded clients. We will rescue you, but you need to protect yourself. Please note that everyone using our IRC servers are subject to the Fuel Rats’ <a href="http://t.fuelr.at/tos">Terms of Service</a> and <a href="http://t.fuelr.at/coc">Code of Conduct</a>.</p>

            <div className="buttons">
              <a
                className="button call-to-action"
                href="https://clients.fuelrats.com:7778/"
                target="_blank">
                Get Rescued
              </a>

              <div>
                <small>Don't need a rescue?</small>

                <a
                  className="button green"
                  href="https://kiwi.fuelrats.com:7778/"
                  target="_blank">
                  Chat with the Fuel Rats
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}





export default Page(INeedFuel, title)
