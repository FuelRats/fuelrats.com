// Component imports
import Component from './Component'
import PortalDialog from './PortalDialog'





export default class extends Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  close () {
    this.setState({ open: false })
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.open !== nextProps.open) {
      this.setState({ open: nextProps.open })
    }
  }

  constructor (props) {
    super(props)

    this._bindMethods(['close'])

    this.state = { open: false }
  }

  render () {
    const { onVisibilityChange } = this.props
    const { open } = this.state

    return (
      <PortalDialog
        onVisibilityChange={onVisibilityChange}
        modal
        open={open}>
        <button
          className="close icon secondary"
          onClick={this.close}
          type="button">
          <i className="fa fa-fw fa-times" />
        </button>

        <header>
          <h2>Merry Squeakmas!</h2>
        </header>

        <div className="content">
          <p>The Fuel Rats are partnering with <a href="https://www.frontier.co.uk/">Frontier</a> for the 12 Days of 🐀🎄Squeakmas! From 1 - 12 December, we'll be encouraging rats and clients alike to make a donation to <a href="https://www.specialeffect.org.uk/">Special Effect</a> to help them continue making video games accessible to people with disabilities!</p>

          <p>By donating, not only do you get to feel all warm and fuzzy inside for doing something kind, but every £1 you donate gets you another entry in Frontier's prize draw!</p>

          <p>On the 11th day of <span aria-label="Rat emoji" role="img">🐀</span><span aria-label="Christmas tree emoji" role="img">🎄</span>Squeakmas, Frontier's community managers Edward Lewis and Bo de Vries will kick off a 24 hour Elite: Dangerous live stream! At the end of the stream they'll be announcing the winners of the prize draw, so don't miss it!</p>
        </div>

        <footer>
          <menu type="toolbar">
            <div className="secondary">
              <button
                className="secondary"
                onClick={() => this.setState({ open: false })}
                type="button">
                No, thanks
              </button>
            </div>

            <div className="primary">
              <a
                className="button"
                href="https://www.justgiving.com/fundraising/frontier-developments"
                rel="noopener noreferrer"
                target="_blank">
                Donate
              </a>
            </div>
          </menu>
        </footer>
      </PortalDialog>
    )
  }
}
