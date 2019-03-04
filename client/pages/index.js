// Module imports
import React from 'react'





// Component imports
import { Link } from '../routes'
import { connect } from '../store'
import PageWrapper from '../components/PageWrapper'
import Carousel from '../components/Carousel'


const CarouselSlides = [
  {
    id: 0,
    text: 'CMDR Highwaywarrior',
    position: '55% 25%',
  },
  {
    id: 1,
    text: 'CMDR Zibadian',
    position: '20% 50%',
  },
  {
    id: 2,
    text: 'CMDR Vanya Pavlovich',
    position: '70% 50%',
  },
  {
    id: 3,
    text: 'CMDR MarathonDog',
    position: '68% 100%',
  },
]

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
    <PageWrapper title="Home" renderHeader={false}>
      <section className="hero">
        <Carousel
          slides={CarouselSlides} />

        <header>
          <h1>We Have Fuel. <wbr />You&nbsp;Don't.</h1>
          <h2>Any Questions?</h2>
        </header>

        <footer className="call-to-action">
          <Link href="/i-need-fuel">
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
