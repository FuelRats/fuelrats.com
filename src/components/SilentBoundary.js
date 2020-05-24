import React from 'react'



/**
 * This is not intended to be a long-term solution. Eventually we will want to flesh this out with some form of error display.
 * Currently we use this as a safeguard from the entire website failing out if a page crashes due to transition timing weirdness.
 */
class SilentBoundary extends React.Component {
  state = {
    hasError: false,
  }

  static getDerivedStateFromError () {
    return { hasError: true }
  }


  render () {
    if (this.state.hasError) {
      return null
    }

    return this.props.children
  }
}





export default SilentBoundary
