// Module imports
import React from 'react'





// Component imports
import Carousel from '../components/Carousel'
import { Link } from '../routes'
import { connect } from '../store'


const CarouselSlides = {
  0: {
    text: 'CMDR Dr Chives',
    position: '13% 50%',
    filename: 'chives.jpg',
  },
  1: {
    text: 'CMDR NumberPi',
    position: '50% 50%',
    filename: 'pi.jpg',
  },
  2: {
    text: 'CMDR RafaBC',
    position: '20% 50%',
    filename: 'rafa.jpg',
  },
  3: {
    text: 'CMDR Vanya Pavlovich',
    position: '70% 50%',
    filename: 'vanya.jpg',
  },
  4: {
    text: 'CMDR Light13c',
    position: '70% 100%',
    filename: 'light.jpg',
  },
  5: {
    text: 'CMDR Wolfger',
    position: '100% 100%',
    filename: 'wolfger.jpg',
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
