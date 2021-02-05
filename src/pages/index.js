import Link from 'next/link'
import Router from 'next/router'
import React from 'react'

import Carousel from '~/components/Carousel'
import FrontPageNotice from '~/components/FrontPageNotice'
import { makeRoute } from '~/helpers/routeGen'
import { connect } from '~/store'





// Component constants
const CarouselSlides = {
  0: {
    text: 'CMDR Dr Chives',
    position: '13% 50%',
    filename: 'chives.jpg',
  },
  1: {
    text: 'CMDR rafaBC_',
    position: '20% 50%',
    filename: 'rafa.jpg',
  },
  2: {
    text: 'CMDR NumberPi',
    position: '50% 50%',
    filename: 'pi.jpg',
  },
  3: {
    text: 'CMDR Worthy Alpaca',
    position: '25% 50%',
    filename: 'worthyalpaca.jpg',
  },
  4: {
    text: 'CMDR Light1c3',
    position: '70% 100%',
    filename: 'light.jpg',
  },
  5: {
    text: 'CMDR Fenrishi',
    position: '40% 50%',
    filename: 'fenrishi.jpg',
  },
}

@connect
class Index extends React.Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static getPageMeta () {
    return { noHeader: true, title: 'Home' }
  }

  componentDidMount () {
    const {
      authenticate,
      ...nextQuery
    } = this.props.query

    if (this.props.query.authenticate) {
      this.props.setFlag('showLoginDialog', true)
      Router.replace(makeRoute('/', nextQuery), undefined, { shallow: true })
    }
  }

  render () {
    return (
      <section className="hero">
        <Carousel id="HomeImages" slides={CarouselSlides} />

        <header>
          <h1>{'We Have Fuel. '}<wbr />{"You\u00a0Don't."}</h1>
          <h2>{'Any Questions?'}</h2>
        </header>

        <footer className="call-to-action">
          <Link href="/i-need-fuel">
            <a className="button tall">{'Get Fuel'}</a>
          </Link>
        </footer>

        <FrontPageNotice />
      </section>
    )
  }

  static mapDispatchToProps = ['setFlag']
}





export default Index


/*

 */
