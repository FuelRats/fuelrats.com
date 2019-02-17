// Module imports
import React from 'react'


// Component imports
import { Link } from '../routes'
import PageWrapper from '../components/PageWrapper'
import Component from '../components/Component'




class INeedFuel extends Component {
  static getInitialProps (ctx) {
    let userAgent = ''

    if (ctx.req && ctx.req.headers['user-agent']) {
      userAgent = ctx.req.headers['user-agent'].toLowerCase()
    } else if (typeof window !== 'undefined') {
      userAgent = window.navigator.userAgent.toLowerCase()
    }

    let isSupported = true
    let supportMessage = () => null

    if (userAgent.match(/playstation/giu)) {
      isSupported = false
      supportMessage = 'The built-in PS4 browser is currently not supported. Please use your phone or computer instead.'
    }

    return {
      browserInfo: {
        supportMessage,
        isSupported,
      },
    }
  }

  render () {
    const {
      browserInfo,
    } = this.props

    return (
      <PageWrapper title="I Need Fuel">

        <div className="page-content">
          <div>
            <img
              alt="Fuel rat riding a limpet"
              className="pull-right"
              src="https://wordpress.fuelrats.com/wp-content/uploads/2016/07/vig_rescue_250-200x126.jpg?resize=200%2C126&ssl=1" />

            <h4>
              DO YOU SEE A BLUE COUNTDOWN TIMER?
              <br />
              If so, quit to the main menu of the game immediately!
            </h4>

            <br />


            {browserInfo.isSupported && (
              <>
                <p>Have you found yourself low on fuel and unable to make it to your nearest refuel point? Never fear! The Fuel Rats are here to help! </p>

                <div className="buttons">
                  <a
                    className="button call-to-action green"
                    href="https://clients.fuelrats.com:7778/"
                    rel="noopener noreferrer"
                    target="_blank">
                    Yes, I Need Fuel!
                  </a>

                  <br />

                  <p>Don't need a fill up? Just looking to chat, or perhaps even help the cause?</p>

                  <a
                    className="button secondary"
                    href="https://kiwi.fuelrats.com/"
                    rel="noopener noreferrer"
                    target="_blank">
                    I don't need fuel, but I still want to chat.
                  </a>
                </div>

                <br />

                <small>
                  {'By connecting to our IRC and using our services, you agree to our '}
                  <Link route="wordpress" params={{ slug: 'terms-of-service' }}>
                    <a>Terms of Service</a>
                  </Link>
                  {' and '}
                  <Link route="wordpress" params={{ slug: 'terms-of-service' }}>
                    <a>Privacy Policy</a>
                  </Link>
                  {'.'}
                </small>
              </>
            )}

            {!browserInfo.isSupported && (<h5>{browserInfo.supportMessage}</h5>)}


          </div>
        </div>
      </PageWrapper>
    )
  }
}




export default INeedFuel
