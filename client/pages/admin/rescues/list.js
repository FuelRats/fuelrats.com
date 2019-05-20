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



@authenticated('isAdministrator')
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
            ? { 'client[ilike]': `${this.state.client}%` }
            : { 'status[ne]': 'closed' },
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
      status,
      system,
    } = rescue.attributes
    return (
      <div key={rescue.id} className="rescue-list-item">
        <Link route="paperwork view" params={{ id: rescue.id }}>
          <a className="primary-info"><small>CMDR</small> {client} <small>in</small> {system}</a>
        </Link>
        <span className="secondary-info"><small>{rescue.id} - {formatAsEliteDateTime(createdAt)}{status === 'closed' ? '' : ` - ${status}`}</small></span>
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
          <div className="searchControls">
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
            {
              rescues.map(ListRescues.renderListItem)
            }
          </div>
        </div>
      </PageWrapper>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/





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
