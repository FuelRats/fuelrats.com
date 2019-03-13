/* eslint-disable react/no-multi-comp */

// Module imports
import { animated } from 'react-spring/renderprops.cjs'
import React from 'react'
import NextHead from 'next/head'
import PropTypes from 'prop-types'





// Component imports
import { TransitionContextConsumer } from './AppLayout'
import Component from './Component'
import classnames from '../helpers/classNames'




// Component constants
const MAX_TITLE_LENGTH = 50
const MAX_DESCR_LENGTH = 300





class Page extends Component {
  constructor (props) {
    super(props)

    /* eslint-disable no-console */
    if (this.props.title.length > MAX_TITLE_LENGTH) {
      console.warn(`Page titles should be fewer than 60 characters, preferably closer to 50. This page's title is ${this.props.title.length} characters.`)
    }

    if (this.props.description.length > MAX_DESCR_LENGTH) {
      console.error(`Page description is too long! The description should be 50-300 characters long, but this page's description is ${this.props.description.length} characters.`)
    }

    if (this.props.description.indexOf('"') !== -1) {
      console.error('Page descriptions shouldn\'t contain double quotes.')
    }
    /* eslint-enable no-console */
  }

  render () {
    const {
      children,
      className,
      darkThemeSafe,
      description,
      title,
      renderHeader,
    } = this.props

    const titleContent = renderHeader && this.displayTitle
    const mainClasses = classnames(
      'page',
      [className, Boolean(className)],
      title.toLowerCase().replace(/\s/gu, '-'),
      ['--experiment-dark-mode', darkThemeSafe]
    )

    return (
      <>
        <NextHead>
          <title>{title} | The Fuel Rats</title>
          <meta property="og:title" content={title} />
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
        </NextHead>
        <TransitionContextConsumer>
          {(style) => (
            <animated.main className={mainClasses} style={style}>
              {renderHeader && (
                <header className="page-header">
                  {titleContent}
                </header>
              )}
              {children}
            </animated.main>
          )}
        </TransitionContextConsumer>
      </>
    )
  }


  get displayTitle () {
    const {
      displayTitle,
      title,
    } = this.props

    if (typeof displayTitle === 'function') {
      return displayTitle(title)
    }

    return (<h1>{displayTitle}</h1>)
  }

  static defaultProps = {
    darkThemeSafe: false,
    description: 'The Fuel Rats are Elite: Dangerous\'s premier emergency refueling service. Fueling the galaxy, one ship at a time, since 3301.',
    displayTitle: (title) => (<h1>{title}</h1>),
    renderHeader: true,
  }

  static propTypes = {
    darkThemeSafe: PropTypes.bool,
    description: PropTypes.string,
    displayTitle: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
    ]),
    renderHeader: PropTypes.bool,
    title: PropTypes.string.isRequired,
  }
}

export default Page
