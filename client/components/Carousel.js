// Module imports
import { Transition, animated } from '@react-spring/web'
import getConfig from 'next/config'
import PropTypes from 'prop-types'
import React from 'react'
import { createSelector, createStructuredSelector } from 'reselect'




// Component imports
import { connect } from '../store'
import { selectImageById } from '../store/selectors'




// Component constants
const { publicRuntimeConfig } = getConfig()
const { publicUrl } = publicRuntimeConfig.local




const selectConnectedSlides = createSelector(
  [
    (state) => state,
    (state, props) => props.slides,
    (state, props) => props.id,
  ],
  (state, slides, compId) => Object.entries(slides).reduce((acc, [key, slide]) => {
    const slideId = `${compId}-${key}`

    return {
      ...acc,
      [slideId]: {
        ...slide,
        id: slideId,
        url: `${publicUrl}/static/images/${slide.imageName || `slide_${key}.jpg`}`,
        image: selectImageById(state, { imageId: slideId }),
      },
    }
  }, {}),
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

    this.setState((state) => ({
      curSlide: typeof slideId === 'undefined'
        ? slideKeys[(slideKeys.indexOf(state.curSlide) + 1) % slideKeys.length]
        : slideId,
    }))
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

  renderSlide () {
    return (
      <Transition
        {...this.transitionProps}
        initial={{ opacity: 1 }}
        from={{ opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}>
        {
          (slide) => slide.image && ((style) => (
            <animated.div
              className="carousel-slide"
              style={{
                ...style,
                backgroundImage: `url(${slide.image})`,
                backgroundPosition: slide.position || 'center',
              }} />
          ))
        }
      </Transition>
    )
  }

  renderSlideText () {
    return (
      <Transition
        {...this.transitionProps}
        initial={{ xPos: 0 }}
        from={{ xPos: 100 }}
        enter={{ xPos: 0 }}
        leave={{ xPos: 100 }}>
        {
          (slide) => slide.image && (({ xPos }) => (
            slide.text
              ? (
                <animated.span
                  className="carousel-slide-text"
                  style={{
                    transform: xPos.to((value) => (value ? `translate3d(${value}%,0,0)` : undefined)),
                  }}>
                  {slide.text}
                </animated.span>
              )
              : null
          ))
        }
      </Transition>
    )
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

    return (
      <div id={id} className={`carousel ${className}`}>
        {this.renderSlide()}
        {this.renderSlideText()}
        <div className="carousel-slide-picker">
          {Object.keys(slides).map((slideId) => (
            <button
              aria-label={`Image carousel slide ${slideId}`}
              className={`circle-button${curSlide === slideId ? ' active' : ''}`}
              name={slideId}
              key={slideId}
              type="button"
              onClick={this._handleSlideButtonClick} />
          ))}
        </div>
      </div>
    )
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  get transitionProps () {
    const { slides } = this.props
    const { curSlide } = this.state
    return {
      items: slides[curSlide],
      keys: slides[curSlide].image ? curSlide : 'null',
      native: true,
      unique: true,
      config: { tension: 280, friction: 85 },
    }
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
    id: PropTypes.string.isRequired,
    interval: PropTypes.number,
    slides: PropTypes.objectOf(PropTypes.shape({
      imageName: PropTypes.string,
      position: PropTypes.string,
      text: PropTypes.any,
    })).isRequired,
  }
}





export default Carousel
