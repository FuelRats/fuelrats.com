import Link from 'next/link'
import Router from 'next/router'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import Carousel from '~/components/Carousel'
import { setFlag } from '~/store/actions/flags'
import makeRoute from '~/util/router/makeRoute'





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


function FuelRatsHome (props) {
  const { authenticate, ...restQuery } = props.query
  const dispatch = useDispatch()

  useEffect(() => {
    if (authenticate) {
      dispatch(setFlag('showLoginDialog', true))
      Router.replace(makeRoute('/', restQuery), undefined, { shallow: true })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- only run on authenticate change, we only care about the state of others when this value changes anyway.
  }, [authenticate])

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
    </section>
  )
}

FuelRatsHome.getPageMeta = () => {
  return {
    noHeader: true,
    title: 'Home',
    key: 'home',
  }
}



export default FuelRatsHome
