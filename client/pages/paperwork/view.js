// Module imports
import React from 'react'
import moment from 'moment'





// Component imports
import { actions, connect } from '../../store'
import { authenticated } from '../../components/AppLayout'
import { Link } from '../../routes'
import Component from '../../components/Component'
import PageWrapper from '../../components/PageWrapper'
import userHasPermission from '../../helpers/userHasPermission'





// Component constants
const PAPERWORK_MAX_EDIT_TIME = 3600000





@authenticated
@connect
class Paperwork extends Component {
  /***************************************************************************\
    Properties
  \***************************************************************************/

  state = {
    loading: !this.props.rescue,
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  async componentDidMount () {
    const { id, rescue } = this.props

    if (id && !rescue) {
      await this.props.getRescue(id)
    }

    if (this.state.loading) {
      this.setState({ loading: false })
    }
  }

  static renderQuote = (quote, index) => {
    const createdAt = moment(quote.createdAt).format('DD MMM, YYYY HH:mm')
    const updatedAt = moment(quote.updatedAt).format('DD MMM, YYYY HH:mm')
    return (
      <li key={index}>
        <div className="times">
          <div className="created" title="Created at">{createdAt}</div>
          {(updatedAt !== createdAt) && (
            <div className="updated" title="Updated at">{updatedAt}</div>
          )}
        </div>
        <span className="message">{quote.message}</span>
        <div className="authors">
          <div className="author" title="Created by">{quote.author}</div>
          {(quote.author !== quote.lastAuthor) && (
            <div className="lastAuthor" title="Last updated by">{quote.lastAuthor}</div>
          )}
        </div>
      </li>
    )
  }

  static async getInitialProps ({ query, store }) {
    await actions.getRescue(query.id)(store.dispatch)
  }

  renderQuotes = () => {
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

  renderRat = (rat, index) => {
    const { rescue } = this.props

    return (
      <li key={index}>
        {rat.attributes.name}
        {(rat.id === rescue.attributes.firstLimpetId) && (
          <span className="badge fl">1st</span>
        )}
      </li>
    )
  }

  renderRats = () => {
    const { rats } = this.props
    const { rescue } = this.props

    return (
      <ul>
        {rats.map(this.renderRat)}
        {rescue.attributes.unidentifiedRats.map((rat) => `${rat}<span className="badge unidentified">UnID</span>`)}
      </ul>
    )
  }

  render () {
    const {
      rescue,
    } = this.props

    const {
      loading,
    } = this.state

    const userCanEdit = this.userCanEdit()

    // This makes 2 new variables called status and outcome, and sets them to the values of the outcome and status in the rescue object.
    let {
      status,
      outcome,
    } = rescue.attributes

    if (status === 'inactive') {
      status = 'open'
      outcome = 'inactive'
    }

    if (status === 'open') {
      outcome = 'active'
    }

    return (
      <PageWrapper title="Paperwork">

        {loading && (
          <div className="loading page-content" />
        )}

        {(!loading && !rescue) && (
          <div className="loading page-content">
            <p>Sorry, we couldn't find the paperwork you requested.</p>
          </div>
        )}

        {(!loading && rescue) && (
          <div className="page-content">
            <menu type="toolbar">
              <div className="primary">
                {userCanEdit && (
                  <Link route="paperwork edit" params={{ id: rescue.id }}>
                    <a className="button">
                        Edit
                    </a>
                  </Link>
                )}
              </div>

              <div className="secondary" />
            </menu>

            <header className="paperwork-header">
              {(rescue.attributes.status !== 'closed') && (
                <div className="board-index"><span>#{rescue.attributes.data.boardIndex}</span></div>
              )}
              <div className="title">
                <span>
                  Rescue of
                  <span className="CMDR-name"> {rescue.attributes.client}</span> in
                  <span className="system"> {(rescue.attributes.system) && (rescue.attributes.system)}</span>
                </span>
              </div>
            </header>

            <div className="tags">
              <div className="tag status-group">
                <span className={`status ${status}`}>{status}</span>
                <span className="outcome">{outcome || 'unfiled'}</span>
              </div>

              {(rescue.attributes.platform) && (
                <div className={`tag platform ${rescue.attributes.platform}`}>{rescue.attributes.platform}</div>
              )}

              {(rescue.attributes.codeRed) && (
                <div className="tag code-red">CR</div>
              )}

              {(rescue.attributes.data.markedForDeletion.marked) && (
                <div className="md-group">
                  <div className="marked-for-deletion">Marked for Deletion</div>
                  <div className="md-reason">{rescue.attributes.data.markedForDeletion.reason}</div>
                  <div className="md-reporter">{rescue.attributes.data.markedForDeletion.reporter}</div>
                </div>
              )}
            </div>

            <div className="info">
              <span className="label">Created</span>
              <span className="date-created content">{moment(rescue.attributes.createdAt).format('DD MMM, YYYY HH:mm')}</span>
              <span className="label">Updated</span>
              <span className="date-updated content">{moment(rescue.attributes.updatedAt).format('DD MMM, YYYY HH:mm')}</span>
              <span className="label">IRC Nick</span>
              <span className="irc-nick content">{rescue.attributes.data.IRCNick}</span>
              <span className="label">Language</span>
              <span className="language content">{rescue.attributes.data.langID}</span>
            </div>

            <div className="panel rats">
              <header>Rats</header>
              <div className="panel-content">{this.renderRats()}</div>
            </div>

            <div className="panel quotes">
              <header>Quotes</header>
              <div className="panel-content">{this.renderQuotes()}</div>
            </div>

            <div className="panel notes">
              <header>Notes</header>
              <div className="panel-content">{rescue.attributes.notes}</div>
            </div>
          </div>
        )}
      </PageWrapper>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  userCanEdit = () => {
    const {
      rescue,
      currentUser,
      currentUserGroups,
    } = this.props

    if (!rescue || !currentUser.relationships) {
      return false
    }

    // Check if current user is assigned to case.
    const assignedRatIds = rescue.relationships.rats.data.map((rat) => rat.id)
    const currentUserRatIds = currentUser.relationships.rats.data.map((rat) => rat.id)

    if (assignedRatIds.some((ratId) => currentUserRatIds.includes(ratId))) {
      return true
    }

    // Check if the paperwork is not yet time locked
    if ((new Date()).getTime() - (new Date(rescue.attributes.createdAt)).getTime() <= PAPERWORK_MAX_EDIT_TIME) {
      return true
    }

    // Check if user has the permission to edit the paperwork anyway
    if (currentUserGroups.length && userHasPermission(currentUserGroups, 'rescue.write')) {
      return true
    }

    return false
  }

  static mapStateToProps = (state, ownProps) => {
    const { id: rescueId } = ownProps.query
    let firstLimpet = []
    let rats = []
    let rescue = null

    if (rescueId) {
      rescue = state.rescues[rescueId]
    }

    if (rescue) {
      if (rescue.relationships.firstLimpet.data) {
        firstLimpet = Object.values(state.rats.rats).filter((rat) => rescue.relationships.firstLimpet.data.id === rat.id)
      }

      rats = Object.values(state.rats.rats)
        .filter((rat) => rescue.relationships.rats.data.find(({ id }) => rat.id === id))
        .map((rat) => ({
          id: rat.id,
          value: rat.attributes.name,
          ...rat,
        }))
    }

    const currentUser = state.user
    const currentUserGroups = currentUser.relationships ? [...currentUser.relationships.groups.data].map((group) => state.groups[group.id]) : []


    return {
      firstLimpet,
      rats,
      rescue,
      currentUser,
      currentUserGroups,
    }
  }

  static mapDispatchToProps = ['getRescue']
}





export default Paperwork
