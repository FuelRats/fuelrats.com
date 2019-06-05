// Module imports
import React from 'react'
import PropTypes from 'prop-types'
import { Transition, animated } from 'react-spring/renderprops.cjs'
import ImageLoaderWorker from '../workers/image-loader.worker'




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
    this.worker = new ImageLoaderWorker()
    this.worker.postMessage('from Host')
    this.worker.addEventListener('message', this.onWorkerMessage)
  }

  componentWillUnmount () {
    clearTimeout(this.timer)
    this.worker.terminate()
  }

  renderSlide () {
    const {
      slides,
    } = this.props
    return (
      <Transition
        native
        reset
        unique
        items={this.state.curSlide}
        from={{ opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}
        config={{ tension: 280, friction: 85 }}>
        {
          (curSlide) => (style) => {
            const slide = slides[curSlide]

            return (
              <animated.div
                className="carousel-slide"
                style={{
                  ...style,
                  backgroundImage: `url(/static/images/${slide.imageName || `slide_${curSlide}.jpg`})`,
                  backgroundPosition: slide.position || 'center',
                }} />
            )
          }
        }
      </Transition>
    )
  }

  renderSlideText () {
    const {
      slides,
    } = this.props
    return (
      <Transition
        native
        reset
        unique
        items={this.state.curSlide}
        from={{ xPos: 100 }}
        enter={{ xPos: 0 }}
        leave={{ xPos: 100 }}
        config={{ tension: 280, friction: 85 }}>
        {
          (curSlide) => ({ xPos }) => {
            const slide = slides[curSlide]

            return (
              slide.text
                ? (
                  <animated.span
                    className="carousel-slide-text"
                    style={{
                      transform: xPos.interpolate((value) => `translate3d(${value}%,0,0)`),
                    }}>
                    {slide.text}
                  </animated.span>
                )
                : null
            )
          }
        }
      </Transition>
    )
  }

  render () {
    const {
      className,
      slides,
    } = this.props

    const {
      curSlide,
    } = this.state



    return (
      <div className={`carousel ${className}`}>
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
    Prop Definitions
  \***************************************************************************/

  static defaultProps = {
    className: '',
    interval: 10000,
  }

  static propTypes = {
    className: PropTypes.string,
    interval: PropTypes.number,
    slides: PropTypes.objectOf(PropTypes.shape({
      imageName: PropTypes.string,
      position: PropTypes.string,
      text: PropTypes.any,
    })).isRequired,
  }
}




export default Carousel
