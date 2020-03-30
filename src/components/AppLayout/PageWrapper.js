/* global $IS_DEVELOPMENT:false */
/* eslint-disable react/no-multi-comp */

// Module imports
import { animated } from '@react-spring/web'
import hoistNonReactStatics from 'hoist-non-react-statics'
import NextHead from 'next/head'
import PropTypes from 'prop-types'
import React from 'react'





// Component imports
import classNames from '../../helpers/classNames'




// Component constants
const MAX_TITLE_LENGTH = 50
const MAX_DESCR_LENGTH = 300



const validatePageOptions = (props) => {
  if (props.title.length > MAX_TITLE_LENGTH) {
    console.warn(`Page titles should be fewer than 60 characters, preferably closer to 50. This page's title is ${props.title.length} characters.`)
  }

  if (props.description.length > MAX_DESCR_LENGTH) {
    console.error(`Page description is too long! The description should be 50-300 characters long, but this page's description is ${props.description.length} characters.`)
  }

  if (props.description.indexOf('"') !== -1) {
    console.error('Page descriptions shouldn\'t contain double quotes.')
  }
}




function PageWrapper (props) {
  if ($IS_DEVELOPMENT) {
    validatePageOptions(props)
  }

  const {
    children,
    className,
    description = 'The Fuel Rats are Elite: Dangerous\'s premier emergency refueling service. Fueling the galaxy, one ship at a time, since 3301.',
    displayTitle,
    noHeader = false,
    title,
    transitionStyle,
  } = props

  const mainClasses = classNames(
    'page',
    className,
    title.toLowerCase().replace(/\s/gu, '-'),
  )

  return (
    <>
      <NextHead>
        <title>{`${title} | The Fuel Rats`}</title>
        <meta content={title} property="og:title" />
        <meta content={description} name="description" />
        <meta content={description} property="og:description" />
      </NextHead>
      <animated.main className={mainClasses} style={transitionStyle}>
        {
          !noHeader && (
            <header className="page-header">
              <h1>
                {displayTitle ?? title}
              </h1>
            </header>
          )
        }
        {children}
      </animated.main>
    </>
  )
}


PageWrapper.propTypes = {
  description: PropTypes.string,
  displayTitle: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
  noHeader: PropTypes.bool,
  title: PropTypes.string.isRequired,
}




const getWrappedPage = (options, PageComponent, filter) => {
  return hoistNonReactStatics((props) => {
    return (
      <PageWrapper {...options}>
        <PageComponent {...props} />
      </PageWrapper>
    )
  }, PageComponent, filter)
}





export default getWrappedPage
