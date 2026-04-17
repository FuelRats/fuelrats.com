import { AnimatePresence, m } from 'motion/react'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createSelector } from 'reselect'


import { getImage } from '~/store/actions/images'
import { selectImages } from '~/store/selectors'
import clsx from 'clsx'





// Component constants
const appUrl = process.env.NEXT_PUBLIC_APP_URL

const getSlides = (_, props) => {
  return props.slides
}

const getId = (_, props) => {
  return props.id
}

const selectSlides = createSelector(
  [getSlides, getId],
  (slides, compId) => {
    return Object.entries(slides).reduce((acc, [key, slide]) => {
      return {
        ...acc,
        [`${compId}-${key}`]: slide,
      }
    }, {})
  },
)

const selectSlideImages = createSelector(
  [selectImages, getSlides, getId],
  (images, slides, compId) => {
    return Object.keys(slides).reduce((acc, key) => {
      const slideId = `${compId}-${key}`
      return {
        ...acc,
        [slideId]: images[slideId],
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

  const slides = useSelector((state) => {
    return selectSlides(state, props)
  })
  const images = useSelector((state) => {
    return selectSlideImages(state, props)
  })
  const [curSlideId, setCurSlide] = useState(Object.keys(slides)[0])

  const curSlide = slides[curSlideId]
  const curSlideUrl = images[curSlideId]

  const timerRef = useRef(null)
  const dispatch = useDispatch()

  const handleSlideButtonClick = useCallback((event) => {
    window.clearTimeout(timerRef.current)
    setCurSlide(event.target.name)
  }, [])

  const setSlide = useCallback((nextSlide) => {
    if (document.visibilityState === 'hidden') {
      timerRef.current = window.setTimeout(setSlide, interval)
      return
    }

    const slideKeys = Object.keys(slides)

    setCurSlide((slideId) => {
      return typeof nextSlide === 'undefined'
        ? slideKeys[(slideKeys.indexOf(slideId) + 1) % slideKeys.length]
        : nextSlide
    })
  }, [slides, interval])

  useEffect(() => {
    Object.entries(slides).forEach(([key, slide]) => {
      if (!images[key]) {
        Promise.resolve(dispatch(getImage({
          id: key,
          url: `${appUrl}/static/images/${slide.filename}`,
        }))).catch(() => {})
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Only perform this on mount since this is a fetch operation.
  }, [])

  useEffect(() => {
    if (curSlideUrl) {
      timerRef.current = window.setTimeout(setSlide, interval)
    }
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- only set a timeout if curSlideUrl changes
  }, [curSlideUrl])

  return (
    <div className={clsx('carousel', className)} id={id}>
      <AnimatePresence>
        {
        Boolean(curSlideUrl) && (
          <m.div
            key={`${curSlideId}-img`}
            {...slideMotionConfig}
            className="carousel-slide"
            src={curSlideUrl}
            style={
              {
                backgroundImage: `url(${curSlideUrl})`,
                backgroundPosition: curSlide.position ?? 'center',
              }
            } />
        )
      }
        {
        Boolean(curSlideUrl && curSlide.text) && (
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
        Object.keys(images).map((slideId) => {
          return (
            <button
              key={slideId}
              aria-label={`Image carousel slide ${slideId}`}
              className={clsx('circle-button', { active: curSlideId === slideId })}
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
