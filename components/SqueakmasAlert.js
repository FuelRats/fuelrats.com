// Module imports
import React from 'react'
import localforage from 'localforage'





// Component imports
import Alert from './Alert'
import Component from './Component'
import SqueakmasDialog from './SqueakmasDialog'





export default class extends Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  async componentDidMount () {
    const squeakmasHasBeenDismissed = await localforage.getItem('squeakmas3303AlertDismissed')

    if (squeakmasHasBeenDismissed !== null) {
      this.setState({ open: false })
    }
  }

  constructor (props) {
    super(props)

    this._bindMethods(['dismiss'])

    this.state = {
      dialogIsOpen: false,
      open: true,
    }
  }

  dismiss () {
    this.setState({ open: false })
    localforage.setItem('squeakmas3303AlertDismissed', (new Date).toISOString())
  }

  render () {
    const {
      dialogIsOpen,
      open,
    } = this.state

    return (
      <React.Fragment>
        <Alert open={open}>
          <div className="squeakmas-alert">
            <div className="earth" />
            <div className="moon" />
            <div className="sun" />
            <div className="limpet limpet1" />
            <div className="limpet limpet2" />
            <div className="limpet limpet3" />

            <div className="content">
              <h1>Squeakmas 3303</h1>

              <div className="buttons">
                <button onClick={() => this.setState({ dialogIsOpen: true })}>
                  Click here to learn more
                </button>

                <button
                  className="secondary"
                  onClick={this.dismiss}>
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </Alert>

        <SqueakmasDialog
          onVisibilityChange={isOpen => this.setState({ dialogIsOpen: isOpen })}
          open={dialogIsOpen} />
      </React.Fragment>
    )
  }
}
