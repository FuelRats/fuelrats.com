// Module imports
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTransition, animated } from 'react-spring'





const Carousel = ({ slides, interval, className }) => {
  const [curSlide, setSlideState] = useState(0)
  const [timeoutRef, setTimeoutRef] = useState(null)

  // slide control logic
  const setSlide = (slideId) => {
    clearTimeout(timeoutRef)
    setSlideState(typeof slideId === 'undefined' ? ((state) => (state + 1) % slides.length) : slideId)
    setTimeoutRef(setTimeout(setSlide, interval))
  }

  // start carousel timer
  useEffect(() => {
    setTimeoutRef(setTimeout(setSlide, interval))
    return () => {
      clearTimeout(timeoutRef)
    }
  }, [])


  // Build animated elements
  const imageElement = useTransition(slides[curSlide], (item) => item.id, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { tension: 280, friction: 85 },
  }).map(({ item, key, props }) => (
    <animated.div
      className="carousel-slide"
      key={key}
      style={{
        ...props,
        backgroundImage: `url(/static/images/${item.imageName || `slide_${item.id}.jpg`})`,
        backgroundPosition: item.position || 'center',
      }} />
  ))

  const textElement = useTransition(slides[curSlide], (item) => item.id, {
    from: { xPos: 100 },
    enter: { xPos: 0 },
    leave: { xPos: 100 },
    config: { tension: 280, friction: 85 },
  }).map(({ item, key, props: { xPos } }) => (
    item.text
      ? (
        <animated.span
          className="carousel-slide-text"
          key={key}
          style={{
            transform: xPos.interpolate((value) => `translate3d(${value}%,0,0)`),
          }}>
          {item.text}
        </animated.span>
      )
      : null
  ))

  return (
    <div className={`carousel ${className}`}>
      {imageElement}
      {textElement}

      <div className="carousel-slide-picker">
        {slides.map((item) => (
          <button
            aria-label={`Image carousel slide ${item.id}`}
            className={`circle-button${curSlide === item.id ? ' active' : ''}`}
            key={item.id}
            type="button"
            onClick={() => setSlide(item.id)} />
        ))}
      </div>
    </div>
  )
}

Carousel.defaultProps = {
  className: '',
  interval: 10000,
}

Carousel.propTypes = {
  className: PropTypes.string,
  interval: PropTypes.number,
  slides: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    imageName: PropTypes.string,
    position: PropTypes.string,
    text: PropTypes.any,
  })).isRequired,
}

export default Carousel
