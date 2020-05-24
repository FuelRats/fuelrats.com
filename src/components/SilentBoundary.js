import React from 'react'




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
