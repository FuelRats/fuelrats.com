// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import withRedux from 'next-redux-wrapper'





// Component imports
import {
  actions,
  initStore,
} from '../../store'
import Component from '../../components/Component'
import Page from '../../components/Page'
import FirstLimpetInput from '../../components/FirstLimpetInput'
import RatTagsInput from '../../components/RatTagsInput'
import SystemTagsInput from '../../components/SystemTagsInput'





class Paperwork extends Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    let { id } = this.props

    if (id) {
      this.props.retrievePaperwork(id)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.rescue !== this.props.rescue) {
      this.setState({
        firstLimpet: nextProps.firstLimpet,
        rats: nextProps.rats,
        rescue: nextProps.rescue,
      })
    }
  }

  constructor (props) {
    super(props)

    this._bindMethods([
      'renderRat',
    ])

    this.state = {
      firstLimpet: props.firstLimpet,
      rats: props.rats,
      rescue: props.rescue || {
        attributes: {
          codeRed: false,
          notes: '',
          outcome: 'success',
          platform: 'pc',
          system: null,
        },
      },
    }
  }

  static async getInitialProps ({ query }) {
    let { id } = query

    if (id) {
      return { id }
    }

    return {}
  }

  renderQuote (quote, index) {
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
    let {
      rescue,
    } = this.state

    return (
      <ol>
        {rescue.attributes.quotes.map(this.renderQuote)}
      </ol>
    )
  }

  renderRat (rat, index) {
    let {
      rats,
      rescue,
    } = this.state

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
    let {
      rats
    } = this.state

    return (
      <ul>
        {rats.map(this.renderRat)}
      </ul>
    )
  }

  render () {
    let {
      path,
      retrieving,
    } = this.props

    let {
      rats,
      rescue,
    } = this.state

    return (
      <Page path={path} title={this.title}>
        <header className="page-header">
          <h2>{this.title}</h2>
        </header>

        <div className="page-content">
          {!retrieving && (
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
          )}
        </div>
      </Page>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get dirtyFields () {
    return this._dirtyFields || (this._dirtyFields = new Set)
  }

  get title () {
    return 'Paperwork'
  }
}





const mapDispatchToProps = dispatch => {
  return {
    submitPaperwork: bindActionCreators(actions.submitPaperwork, dispatch),
    retrievePaperwork: bindActionCreators(actions.retrievePaperwork, dispatch),
  }
}

const mapStateToProps = state => {
  let {
    paperwork,
  } = state
  let {
    rescueId,
  } = paperwork
  let firstLimpet = []
  let rats = []
  let rescue = null

  if (rescueId) {
    rescue = state.rescues.rescues.find(rescue => rescue.id === rescueId)
  }

  if (rescue) {
    if (rescue.relationships.firstLimpet.data) {
      firstLimpet = state.rats.rats.filter(rat => rescue.relationships.firstLimpet.data.id === rat.id)
    }

    rats = state.rats.rats
      .filter(rat => rescue.relationships.rats.data.find(({ id }) => rat.id === id))
      .map(rat => {
        return Object.assign({
          id: rat.id,
          value: rat.attributes.name,
        }, rat)
      })
  }

  return Object.assign({
    firstLimpet,
    rats,
    rescue,
  }, paperwork)
}





export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Paperwork)
