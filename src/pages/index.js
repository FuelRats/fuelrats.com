// Module imports
import React from 'react'





// Component imports
import Carousel from '../components/Carousel'
import { Link } from '../routes'
import { connect } from '../store'


const CarouselSlides = {
  0: {
    text: 'CMDR Highwaywarrior',
    position: '55% 25%',
  },
  1: {
    text: 'CMDR Zibadian',
    position: '20% 50%',
  },
  2: {
    text: 'CMDR Vanya Pavlovich',
    position: '70% 50%',
  },
  3: {
    text: 'CMDR MarathonDog',
    position: '68% 100%',
  },
  4: {
    text: 'CMDR NumberPi',
    position: '100% 100%',
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
