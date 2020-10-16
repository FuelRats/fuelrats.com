/* eslint-disable id-length -- framer needs a property named "x" */
// Module imports
import { AnimatePresence, motion } from 'framer-motion'
import getConfig from 'next/config'
import PropTypes from 'prop-types'
import React from 'react'
import { createSelector, createStructuredSelector } from 'reselect'




// Component imports
import { connect } from '~/store'
import { selectImages } from '~/store/selectors'




// Component constants
const { publicRuntimeConfig } = getConfig()
const { publicUrl } = publicRuntimeConfig.local


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
          url: `${publicUrl}/static/images/${slide.filename || `slide_${key}.jpg`}`,
          image: images[slideId],
        },
      }
    }, {})
  },
)





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
              <motion.div
                key={`${curSlide}-img`}
                animate={{ opacity: 1 }}
                className="carousel-slide"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
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
              <motion.span
                key={`${curSlide}-text`}
                animate={{ x: 0 }}
                className="carousel-slide-text"
                exit={{ x: '100%' }}
                initial={{ x: '100%' }}>
                {slide.text}
              </motion.span>
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
