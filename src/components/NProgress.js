import Router from 'next/router'
import NProgressLib from 'nprogress'
import React from 'react'





// Component constants
const minimumChangeTime = 250





class NProgress extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  timer = null





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleRouteChangeStart = () => {
    clearTimeout(this.timer)
    this.timer = setTimeout(NProgressLib.start, minimumChangeTime)
  }

  _handleRouteChangeDone = () => {
    clearTimeout(this.timer)
    NProgressLib.done()
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    NProgressLib.configure(this.props)

    Router.events.on('routeChangeStart', this._handleRouteChangeStart)
    Router.events.on('routeChangeComplete', this._handleRouteChangeDone)
    Router.events.on('routeChangeError', this._handleRouteChangeDone)
  }

  componentWillUnmount () {
    Router.events.off('routeChangeStart', this._handleRouteChangeStart)
    Router.events.off('routeChangeComplete', this._handleRouteChangeDone)
    Router.events.off('routeChangeError', this._handleRouteChangeDone)
  }

  render () {
    return null
  }


  /***************************************************************************\
    Prop Properties
  \***************************************************************************/

  static defaultProps = {
    minimum: 0.15,
    showSpinner: false,
  }
}





export default NProgress
