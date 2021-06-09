import getConfig from 'next/config'
import Image from 'next/image'
import Link from 'next/link'
import { createStructuredSelector } from 'reselect'

import { connect } from '~/store'
import { selectSession } from '~/store/selectors'





const { publicRuntimeConfig } = getConfig()
const { irc: ircURLs } = publicRuntimeConfig





function INeedFuel (props) {
  const {
    session,
  } = props

  let supportMessage = null

  if (session.userAgent.match(/playstation/giu)) {
    supportMessage = `
      The built-in PS4 browser is currently not supported.
      This is due to bugs in the PS4 browser, and outside of our control.
      Please use your phone or computer instead.
    `
  }

  return (
    <div className="page-content">
      <div>
        <div className="pull-right">
          <Image
            alt="Fuel rat riding a limpet"
            height={126}
            src="https://wordpress.fuelrats.com/wp-content/uploads/2016/07/vig_rescue_250-200x126.jpg?resize=200%2C126&ssl=1"
            width={200} />
        </div>
        <h4>
          {'DO YOU SEE A "OXYGEN DEPLETED IN" TIMER?'}
          <br />
          {'If so, quit to the main menu of the game immediately!'}
        </h4>

        <br />

        {supportMessage && (<h5>{supportMessage}</h5>)}

        {
          !supportMessage && (
            <>
              <p>{'Have you found yourself low on fuel and unable to make it to your nearest refuel point? Never fear! The Fuel Rats are here to help!'}</p>

              <div className="buttons">
                <a
                  className="button call-to-action green"
                  href={ircURLs.client}
                  rel="noopener noreferrer"
                  target="_blank">
                  {'Yes, I Need Fuel!'}
                </a>

                <br />

                <p>{"Don't need a fill up? Just looking to chat, or perhaps even help the cause?"}</p>

                <a
                  className="button secondary"
                  href={ircURLs.rat}
                  rel="noopener noreferrer"
                  target="_blank">
                  {"I don't need fuel, but I still want to chat."}
                </a>
              </div>

              <br />

              <strong>
                {'By connecting to our IRC and using our services, you agree to our '}
                <Link href="/terms-of-service">
                  <a>{'Terms of Service'}</a>
                </Link>
                {' and '}
                <Link href="/privacy-policy">
                  <a>{'Privacy Policy'}</a>
                </Link>
                {'.'}
              </strong>
            </>
          )
        }
      </div>
    </div>
  )
}

INeedFuel.getPageMeta = () => {
  return {
    title: 'I Need Fuel',
  }
}

INeedFuel.mapStateToProps = createStructuredSelector({
  session: selectSession,
})


export default connect(INeedFuel)
