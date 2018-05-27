/* eslint-disable react/no-multi-comp */

// Module imports
import { Fragment } from 'react'
import NextHead from 'next/head'
import PropTypes from 'prop-types'





// Component imports
import Component from './Component'





class Page extends Component {
  constructor (props) {
    super(props)

    /* eslint-disable no-console */
    if (this.props.title.length > 50) {
      console.warn(`Page titles should be fewer than 60 characters, preferably closer to 50. This page's title is ${this.props.title.length} characters.`)
    }

    if (this.props.description.length > 300) {
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
      description,
      title,
      renderTitle,
    } = this.props

    const displayTitle = typeof renderTitle === 'function' ? renderTitle() : (<h1>{title}</h1>)
    const mainClasses = ['fade-in', 'page', title.toLowerCase().replace(/\s/g, '-')].join(' ')

    return (
      <Fragment>
        <NextHead>
          <title>{title} | The Fuel Rats</title>
          <meta property="og:title" content={title} />
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
        </NextHead>
        <main className={mainClasses}>
          <header className="page-header">
            {displayTitle}
          </header>
          {children}
        </main>
      </Fragment>
    )
  }

  static defaultProps = {
    description: 'The Fuel Rats are Elite: Dangerous\'s premier emergency refueling service. Fueling the galaxy, one ship at a time, since 3301.',
    renderTitle: null,
  }
  static propTypes = {
    title: PropTypes.string.isRequired,
    renderTitle: PropTypes.function,
    description: PropTypes.string,
  }
}

export default Page
