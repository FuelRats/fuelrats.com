// Module imports
import React from 'react'





// Component imports
import { Link } from '../routes'
import { PageWrapper } from '../components/AppLayout'
import { connect } from '../store'
import Carousel from '../components/Carousel'


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

  componentDidMount () {
    if (this.props.query.authenticate) {
      this.props.setFlag('showLoginDialog', true)
    }
  }

  render = () => (
    <PageWrapper title="Home" noHeader>
      <section className="hero">
        <Carousel id="HomeImages" slides={CarouselSlides} />

        <header>
          <h1>We Have Fuel. <wbr />You&nbsp;Don't.</h1>
          <h2>Any Questions?</h2>
        </header>

        <footer className="call-to-action">
          <Link route="rescue-landing">
            <a className="button tall">Get Help</a>
          </Link>
        </footer>


      </section>
    </PageWrapper>
  )

  static mapDispatchToProps = ['setFlag']
}





export default Index


/*

 */
