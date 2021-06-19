import { AnimatePresence, m } from 'framer-motion'
import getConfig from 'next/config'
import PropTypes from 'prop-types'
import React from 'react'
import { createSelector, createStructuredSelector } from 'reselect'

import { connect } from '~/store'
import { selectImages } from '~/store/selectors'





// Component constants
const { publicRuntimeConfig } = getConfig()
const { appUrl } = publicRuntimeConfig

const getSlides = (_, props) => {
  return props.slides
}
const getId = (_, props) => {
  return props.id
}

const selectConnectedSlides = createSelector(
  [selectImages, getSlides, getId],
  (images, slides, compId) => {
    return Object.entries(slides).reduce((acc, [key, slide]) => {
      const slideId = `${compId}-${key}`

      return {
        ...acc,
        [slideId]: {
          ...slide,
          id: slideId,
          url: `${appUrl}/static/images/${slide.filename || `slide_${key}.jpg`}`,
          image: images[slideId],
        },
      }
    }, {})
  },
)

/* eslint-disable id-length */
const slideMotionConfig = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

const slideTextMotionConfig = {
  initial: { x: '100%' },
  animate: { x: '0%' },
  exit: { x: '100%' },
  transition: {
    type: 'spring',
    stiffness: 550,
    damping: 100,
  },
}
/* eslint-enable id-length */





@connect
class Carousel extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    curSlide: Object.keys(this.props.slides)[0],
  }

  timer = null





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleSlideButtonClick = (event) => {
    this._setSlide(event.target.name)
  }

  _setSlide = (slideId) => {
    clearTimeout(this.timer)
    this.timer = setTimeout(this._setSlide, this.props.interval)

    if (document.visibilityState === 'hidden') {
      return
    }

    const slideKeys = Object.keys(this.props.slides)

    this.setState((state) => {
      return {
        curSlide: typeof slideId === 'undefined'
          ? slideKeys[(slideKeys.indexOf(state.curSlide) + 1) % slideKeys.length]
          : slideId,
      }
    })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    this.timer = setTimeout(this._setSlide, this.props.interval)

    Object.values(this.props.slides).forEach((slide) => {
      if (!slide.image) {
        this.props.getImage(slide)
      }
    })
  }

  componentWillUnmount () {
    clearTimeout(this.timer)
  }

  render () {
    const {
      className,
      slides,
      id,
    } = this.props

    const {
      curSlide,
    } = this.state

    const slide = this.props.slides[curSlide]

    return (
      <div className={['carousel', className]} id={id}>
        <AnimatePresence>
          {
            Boolean(slide.image) && (
              <m.div
                key={`${curSlide}-img`}
                {...slideMotionConfig}
                className="carousel-slide"
                src={slide.image}
                style={
                  {
                    backgroundImage: `url(${slide.image})`,
                    backgroundPosition: slide.position || 'center',
                  }
                } />
            )
          }
          {
            Boolean(slide.image && slide.text) && (
              <m.span
                key={`${curSlide}-text`}
                {...slideTextMotionConfig}
                className="carousel-slide-text">
                {slide.text}
              </m.span>
            )
          }
        </AnimatePresence>
        <div className="carousel-slide-picker">
          {
            Object.keys(slides).map((slideId) => {
              return (
                <button
                  key={slideId}
                  aria-label={`Image carousel slide ${slideId}`}
                  className={['circle-button', { active: curSlide === slideId }]}
                  name={slideId}
                  type="button"
                  onClick={this._handleSlideButtonClick} />
              )
            })
          }
        </div>
      </div>
    )
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['getImage']

  static mapStateToProps = createStructuredSelector({
    slides: selectConnectedSlides,
  })





  /***************************************************************************\
    Prop Definitions
  \***************************************************************************/

  static defaultProps = {
    className: '',
    interval: 10000,
  }

  static propTypes = {
    className: PropTypes.string,
    getImage: PropTypes.func,
    id: PropTypes.string.isRequired,
    interval: PropTypes.number,
    slides: PropTypes.objectOf(PropTypes.shape({
      filename: PropTypes.string,
      image: PropTypes.string,
      position: PropTypes.string,
      text: PropTypes.any,
    })).isRequired,
  }
}





export default Carousel
