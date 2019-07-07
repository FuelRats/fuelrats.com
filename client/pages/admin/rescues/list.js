// Module imports
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import debounce from 'lodash/debounce'





// Component imports
import { connect, actions } from '../../../store'
import { Link } from '../../../routes'
import { selectPageViewDataById, selectPageViewMetaById } from '../../../store/selectors'
import { formatAsEliteDateTime } from '../../../helpers/formatTime'
import { authenticated } from '../../../components/AppLayout'
import PageWrapper from '../../../components/PageWrapper'




// Component Constants
const viewUpdateDebounceTime = 500
const viewUpdateMaxWaitTime = 1000
const pageViewId = 'admin-rescue-list'



@authenticated('rescue.write')
@connect
class ListRescues extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    client: '',
    loading: false,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleSearchChange = (event) => {
    this.setState({
      client: event.target.value,
    }, this._updateView)
  }

  _handleRefreshClick = () => {
    this.setState({
      loading: true,
    }, this._updateView)
  }

  _updateView = debounce(() => {
    this.setState(
      { loading: true },
      async () => {
        await this.props.getRescues(
          this.state.client
            ? { 'client.ilike': `${this.state.client}%` }
            : { 'status.ne': 'closed' },
          {
            pageView: pageViewId,
          }
        )

        this.setState({ loading: false })
      }
    )
  }, viewUpdateDebounceTime, { maxWait: viewUpdateMaxWaitTime })

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps ({ store }) {
    await actions.getRescues({
      'status[ne]': 'closed',
    }, { pageView: pageViewId })(store.dispatch)
  }

  static renderListItem (rescue) {
    const {
      client,
      createdAt,
      data,
      outcome,
      status,
      system,
    } = rescue.attributes

    let statusIcon = null

    if (status === 'closed' && !outcome) {
      statusIcon = {
        icon: 'folder-open',
        text: 'This rescue has not yet been filed.',
      }
    }

    if (data && data.markedForDeletion && data.markedForDeletion.marked) {
      statusIcon = {
        icon: 'trash',
        text: 'This rescue is marked for deletion',
      }
    }

    return (
      <div key={rescue.id} className="rescue-list-item">
        <span className="primary-info">
          <Link route="paperwork" params={{ rescueId: rescue.id }}>
            <a><small>CMDR</small> {client} <small>in</small> {system}</a>
          </Link>
        </span>
        <span className="secondary-info">
          <small>{rescue.id} - {formatAsEliteDateTime(createdAt)}{status === 'closed' ? '' : ` - ${status}`}</small>
          {statusIcon && (
            <span
              className="status-icon"
              title={statusIcon.text}>
              <FontAwesomeIcon icon={statusIcon.icon} fixedWidth size="2x" />
            </span>
          )}
        </span>
      </div>
    )
  }

  render () {
    const {
      loading,
    } = this.state

    const {
      rescues,
    } = this.props

    return (
      <PageWrapper title="Rescue Search">
        <div className="page-content">
          <div className="search-controls">
            <button
              className="inline"
              onClick={this._handleRefreshClick}
              type="button">
              <FontAwesomeIcon icon="sync" fixedWidth spin={loading} />
            </button>
          </div>
          <div className="searchInput">
            <input
              aria-label="Search by client name"
              id="ClientNameInput"
              className="input"
              placeholder="Client Name"
              name="client"
              type="text"
              onChange={this._handleSearchChange}
              value={this.state.client} />
          </div>
          <div className="rescue-list flex column">
            {rescues.map(ListRescues.renderListItem)}
          </div>
        </div>
      </PageWrapper>
    )
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['getRescues']

  static mapStateToProps = (state) => ({
    rescues: selectPageViewDataById(state, { pageViewId }) || [],
    meta: selectPageViewMetaById(state, { pageViewId }),
  })
}





export default ListRescues
