// Module imports
import moment from 'moment'





// Component imports
import Component from '../../components/Component'
import Page from '../../components/Page'





// Component imports
const title = 'Paperwork'





class Paperwork extends Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    const { id } = this.props.query

    if (id) {
      this.props.retrievePaperwork(id)
    }
  }

  constructor (props) {
    super(props)

    this._bindMethods([
      'renderRat',
    ])
  }

  static renderQuote (quote, index) {
    return (
      <li key={index}>
        {quote.message}
        {!!quote.author && (
          <span>
            - <em>${quote.author}</em>
          </span>
        )}
      </li>
    )
  }

  renderQuotes () {
    const { rescue } = this.props

    if (rescue.attributes.quotes) {
      return (
        <ol>
          {rescue.attributes.quotes.map(Paperwork.renderQuote)}
        </ol>
      )
    }

    return (
      <span>N/A</span>
    )
  }

  renderRat (rat, index) {
    const { rescue } = this.props

    return (
      <li key={index}>
        {rat.attributes.name}
        {(rat.id === rescue.attributes.firstLimpetId) && (
          <span className="badge">First Limpet</span>
        )}
      </li>
    )
  }

  renderRats () {
    const { rats } = this.props

    return (
      <ul>
        {rats.map(this.renderRat)}
      </ul>
    )
  }

  render () {
    const {
      rescue,
      retrieving,
    } = this.props

    return (
      <div className="page-wrapper">
        <header className="page-header">
          <h1>{title}</h1>
        </header>

        {retrieving && (
          <div className="loading page-content" />
        )}

        {(!retrieving && !rescue) && (
          <div className="loading page-content">
            <p>Sorry, we couldn't find the paperwork you requested.</p>
          </div>
        )}

        {(!retrieving && rescue) && (
          <div className="page-content">
            <table>
              <tbody>
                <tr>
                  <th>Created</th>
                  <td>{moment(rescue.attributes.createdAt).format('DD MMM, YYYY HH:mm')}</td>
                </tr>

                <tr>
                  <th>Updated</th>
                  <td>{moment(rescue.attributes.updatedAt).format('DD MMM, YYYY HH:mm')}</td>
                </tr>

                <tr>
                  <th>Platform</th>
                  <td>{rescue.attributes.platform}</td>
                </tr>

                <tr>
                  <th>Status</th>
                  <td>{rescue.attributes.status}</td>
                </tr>

                <tr>
                  <th>Outcome</th>
                  <td>{rescue.attributes.outcome}</td>
                </tr>

                <tr>
                  <th>Code Red</th>
                  <td>{rescue.attributes.codeRed ? 'Yes' : 'No'}</td>
                </tr>

                <tr>
                  <th>Rats</th>
                  <td>{this.renderRats()}</td>
                </tr>

                <tr>
                  <th>System</th>
                  <td>{rescue.attributes.system}</td>
                </tr>

                <tr>
                  <th>Quotes</th>
                  <td>{this.renderQuotes()}</td>
                </tr>

                <tr>
                  <th>Notes</th>
                  <td>{rescue.attributes.notes}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get dirtyFields () {
    return this._dirtyFields || (this._dirtyFields = new Set)
  }
}





const mapDispatchToProps = ['retrievePaperwork']

const mapStateToProps = state => {
  const { paperwork } = state
  const { rescueId } = paperwork
  let firstLimpet = []
  let rats = []
  let rescue = null

  if (rescueId) {
    rescue = state.rescues.rescues.find(item => item.id === rescueId)
  }

  if (rescue) {
    if (rescue.relationships.firstLimpet.data) {
      firstLimpet = state.rats.rats.filter(rat => rescue.relationships.firstLimpet.data.id === rat.id)
    }

    rats = state.rats.rats
      .filter(rat => rescue.relationships.rats.data.find(({ id }) => rat.id === id))
      .map(rat => Object.assign({
        id: rat.id,
        value: rat.attributes.name,
      }, rat))
  }

  return Object.assign({
    firstLimpet,
    rats,
    rescue,
  }, paperwork)
}





export default Page(Paperwork, title, {
  mapStateToProps,
  mapDispatchToProps,
})
