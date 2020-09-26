// Module imports
import React from 'react'





// Component imports
import Carousel from '~/components/Carousel'
import { Link, Router } from '~/routes'
import { connect } from '~/store'


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
    if (this.props.query.authenticate) {
      this.props.setFlag('showLoginDialog', true)
      const nextQuery = { ...this.props.query }
      delete nextQuery.authenticate

      Router.replaceRoute(Router.router.route, nextQuery, { shallow: true })
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
          <Link route="rescue-landing">
            <a className="button tall">{'Get Fuel'}</a>
          </Link>
        </footer>


      </section>
    )
  }

  static mapDispatchToProps = ['setFlag']
}





export default Index


/*

 */
