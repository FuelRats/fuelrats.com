import { AnimatePresence, m } from 'framer-motion'
import getConfig from 'next/config'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { createSelector } from 'reselect'


import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import { getImage } from '~/store/actions/images'
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
          url: `${appUrl}/static/images/${slide.filename ?? `slide_${key}.jpg`}`,
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



function Carousel (props) {
  const {
    id,
    className,
    interval = 10000,
  } = props

  const imageSlides = useSelectorWithProps(props, selectConnectedSlides)
  const [curSlideId, setCurSlide] = useState(Object.keys(imageSlides)[0])

  const timerRef = useRef(null)

  const dispatch = useDispatch()

  const setSlide = useCallback((nextSlide) => {
    timerRef.current = window.setTimeout(setSlide, interval)

    if (document.visibilityState === 'hidden') {
      return
    }

    const slideKeys = Object.keys(imageSlides)

    setCurSlide((slideId) => {
      return typeof nextSlide === 'undefined'
        ? slideKeys[(slideKeys.indexOf(slideId) + 1) % slideKeys.length]
        : nextSlide
    })
  }, [imageSlides, interval])

  useEffect(() => {
    Object.values(imageSlides).forEach((slide) => {
      if (!slide.image) {
        dispatch(getImage(slide))
      }
    })
  }, [dispatch, imageSlides])

  useEffect(() => {
    setSlide()
    return () => {
      window.clearTimeout(timerRef.current)
    }
  }, [setSlide])

  const handleSlideButtonClick = useCallback((event) => {
    window.clearTimeout(timerRef.current)
    setCurSlide(event.target.name)
  }, [])


  const curSlide = imageSlides[curSlideId]

  return (
    <div className={['carousel', className]} id={id}>
      <AnimatePresence>
        {
        Boolean(curSlide.image) && (
          <m.div
            key={`${curSlideId}-img`}
            {...slideMotionConfig}
            className="carousel-slide"
            src={curSlide.image}
            style={
              {
                backgroundImage: `url(${curSlide.image})`,
                backgroundPosition: curSlide.position ?? 'center',
              }
            } />
        )
      }
        {
        Boolean(curSlide.image && curSlide.text) && (
          <m.span
            key={`${curSlideId}-text`}
            {...slideTextMotionConfig}
            className="carousel-slide-text">
            {curSlide.text}
          </m.span>
        )
      }
      </AnimatePresence>
      <div className="carousel-slide-picker">
        {
        Object.keys(imageSlides).map((slideId) => {
          return (
            <button
              key={slideId}
              aria-label={`Image carousel slide ${slideId}`}
              className={['circle-button', { active: curSlideId === slideId }]}
              name={slideId}
              type="button"
              onClick={handleSlideButtonClick} />
          )
        })
      }
      </div>
    </div>
  )
}

Carousel.propTypes = {
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





export default Carousel
