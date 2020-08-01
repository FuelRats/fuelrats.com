// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'





// Component imports
import { authenticated } from '~/components/AppLayout'
import { formatAsEliteDateTime } from '~/helpers/formatTime'
import { Link, Router } from '~/routes'
import { connect } from '~/store'
import { getRescue } from '~/store/actions/rescues'
import {
  selectRatsByRescueId,
  selectRescueById,
  selectCurrentUserCanEditRescue,
  selectCurrentUserHasScope,
} from '~/store/selectors'





@authenticated
@connect
class Paperwork extends React.Component {
  /***************************************************************************\
    Properties
  \***************************************************************************/

  state = {
    deleteConfirm: false,
    deleting: false,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleDeleteClick = async () => {
    if (this.state.deleteConfirm) {
      this.setState({ deleting: true })
      // TODO: Add error handling
      await this.props.deleteRescue(this.props.rescue)

      Router.pushRoute(
        this.props.userCanWriteAll
          ? 'admin rescues list'
          : '/',
      )

      return
    }

    this.setState({ deleteConfirm: true })
  }

  _handleDeleteCancel = () => {
    this.setState({ deleteConfirm: false })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static renderQuote = (quote) => {
    const createdAt = formatAsEliteDateTime(quote.createdAt)
    const updatedAt = formatAsEliteDateTime(quote.updatedAt)
    return (
      <li key={quote.createdAt}>
        <div className="times">
          <div className="created" title="Created at">{createdAt}</div>
          {
            (updatedAt !== createdAt) && (
              <div className="updated" title="Updated at">
                <span className="label">{'Updated at '}</span>
                {updatedAt}
              </div>
            )
          }
        </div>
        <span className="message">{quote.message}</span>
        <div className="authors">
          <div className="author" title="Created by">{quote.author}</div>
          {
            (quote.author !== quote.lastAuthor) && (
              <div className="last-author" title="Last updated by">
                <span className="label">{'Updated by '}</span>
                {quote.lastAuthor}
              </div>
            )
          }
        </div>
      </li>
    )
  }

  static async getInitialProps ({ query, store }) {
    const state = store.getState()

    if (!selectRescueById(state, query)) {
      await store.dispatch(getRescue(query.rescueId))
    }
  }

  static getPageMeta () {
    return {
      title: 'Paperwork',
    }
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
      <span>{'N/A'}</span>
    )
  }

  renderRat = (rat) => {
    const { rescue } = this.props
    return (
      <li key={rat.id} className="first-limpet">
        {rat.attributes.name}
        {
          (rat.id === rescue.relationships.firstLimpet?.data?.id) && (
            <span className="badge first-limpet">{'1st'}</span>
          )
        }
      </li>
    )
  }

  renderRats = () => {
    const { rats } = this.props
    const { rescue } = this.props

    return (
      <ul>
        {rats.map(this.renderRat)}
        {
          rescue.attributes.unidentifiedRats.map((rat) => {
            return <li key={rat} className="unidentified">{rat}<span className="badge">{'UnID'}</span></li>
          })
        }
      </ul>
    )
  }

  renderRescue = () => {
    const {
      rescue,
      userCanEdit,
      userCanWriteAll,
    } = this.props

    const {
      deleteConfirm,
      deleting,
    } = this.state

    // This makes 2 new variables called status and outcome, and sets them to the values of the outcome and status in the rescue object.
    let {
      status,
      outcome,
    } = rescue.attributes

    if (status === 'inactive') {
      status = 'open'
      outcome = 'inactive'
    } else if (status === 'open') {
      outcome = 'active'
    }

    return (
      <>
        <menu type="toolbar">
          <div className="primary">
            {
              deleteConfirm && (
                <>
                  {
                    deleting
                      ? (
                        <span>{'Deleting... '}<FontAwesomeIcon fixedWidth pulse icon="spinner" /> </span>
                      )
                      : (
                        <span>{'Delete this rescue? (This cannot be undone!) '}</span>
                      )
                }

                  <button
                    className="compact"
                    disabled={deleting}
                    type="button"
                    onClick={this._handleDeleteClick}>
                    {'Yes'}
                  </button>

                  <button
                    className="compact"
                    disabled={deleting}
                    type="button"
                    onClick={this._handleDeleteCancel}>
                    {'No'}
                  </button>
                </>
              )
            }

            {
              !deleteConfirm && (
                <>
                  {
                    userCanEdit && (
                      <Link params={{ rescueId: rescue.id }} route="paperwork edit">
                        <a className="button compact">
                          {'Edit'}
                        </a>
                      </Link>
                    )
                  }
                  {
                    userCanWriteAll && (
                      <button
                        className="compact"
                        type="button"
                        onClick={this._handleDeleteClick}>
                        {'Delete'}
                      </button>
                    )
                  }
                </>
              )
            }
          </div>

          <div className="secondary" />
        </menu>

        <header className="paperwork-header">
          {
            (rescue.attributes.status !== 'closed') && (typeof rescue.attributes.commandIdentifier === 'number') && (
              <div className="board-index"><span>{`#${rescue.attributes.commandIdentifier}`}</span></div>
            )
          }
          <div className="title">
            {
              (!rescue.attributes.title) && (
                <span>
                  {'Rescue of '}
                  <span className="cmdr-name">{rescue.attributes.client}</span>
                  {' in '}
                  <span className="system">{(rescue.attributes.system) || ('Unknown')}</span>
                </span>
              )
            }
            {
              (rescue.attributes.title) && (
                <span>
                  {'Operation '}
                  <span className="rescue-title">{rescue.attributes.title}</span>
                </span>
              )
            }
          </div>
        </header>

        <div className="rescue-tags">
          <div className="tag status-group">
            <span className={['status', status]}>{status}</span>
            <span className="outcome">{outcome || 'unfiled'}</span>
          </div>

          <div className={['tag platform', rescue.attributes.platform ?? 'none']}>
            {rescue.attributes.platform || 'No Platform'}
          </div>

          {
            (rescue.attributes.codeRed) && (
              <div className="tag code-red">{'CR'}</div>
            )
          }

          {
            rescue.attributes.outcome === 'purge' && (
              <div className="md-group">
                <div className="marked-for-deletion">{'Marked for Deletion'}</div>
                <div className="md-reason">
                  {`"${rescue.attributes.notes}"`}
                </div>
              </div>
            )
          }
        </div>

        <div className="info">
          {
            (rescue.attributes.title) && (
              <>
                <span className="label">{'Client '}</span>
                <span className="cmdr-name">{rescue.attributes.client}</span>
                <span className="label">{'System '}</span>
                <span className="system">{(rescue.attributes.system) || ('Unknown')}</span>
              </>
            )
          }
          <span className="label">{'Created'}</span>
          <span className="date-created content">{formatAsEliteDateTime(rescue.attributes.createdAt)}</span>
          <span className="label">{'Updated'}</span>
          <span className="date-updated content">{formatAsEliteDateTime(rescue.attributes.updatedAt)}</span>
          <span className="label">{'IRC Nick'}</span>
          <span className="irc-nick content">{rescue.attributes.clientNick}</span>
          <span className="label">{'Language'}</span>
          <span className="language content">{rescue.attributes.clientLanguage}</span>
        </div>

        <div className="panel rats">
          <header>{'Rats'}</header>
          <div className="panel-content">{this.renderRats()}</div>
        </div>

        <div className="panel quotes">
          <header>{'Quotes'}</header>
          <div className="panel-content">{this.renderQuotes()}</div>
        </div>

        {
          rescue.attributes.outcome !== 'purge' && (
            <div className="panel notes">
              <header>{'Notes'}</header>
              <div className="panel-content">{rescue.attributes.notes}</div>
            </div>
          )
        }


      </>
    )
  }

  render () {
    const {
      rescue,
    } = this.props

    return (
      <>
        {
          (!rescue) && (
            <div className="loading page-content">
              <p>{"Sorry, we couldn't find the paperwork you requested."}</p>
            </div>
          )
        }

        {
          (rescue) && (
            <div className="page-content">
              {this.renderRescue()}
            </div>
          )
        }
      </>
    )
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['deleteRescue']

  static mapStateToProps = (state, { query }) => {
    return {
      rats: selectRatsByRescueId(state, query) || [],
      rescue: selectRescueById(state, query),
      userCanEdit: selectCurrentUserCanEditRescue(state, query),
      userCanWriteAll: selectCurrentUserHasScope(state, { scope: 'rescues.write' }),
    }
  }
}





export default Paperwork
