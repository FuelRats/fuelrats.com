import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import debounce from 'lodash/debounce'
import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { authenticated } from '~/components/AppLayout'
import { getRescues } from '~/store/actions/rescues'
import { selectPageViewDataById } from '~/store/selectors'
import formatAsEliteDateTime from '~/util/date/formatAsEliteDateTime'
import makePaperworkRoute from '~/util/router/makePaperworkRoute'




// Component Constants
const VIEW_UPDATE_DEBOUNCE_MS = 500
const VIEW_UPDATE_MAX_WAIT_MS = 1000
const PAGE_VIEW_ID = 'admin-rescue-list'




function renderListItem (rescue) {
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
        <Link href={makePaperworkRoute({ rescueId: rescue.id })}>
          <small>{'CMDR '}</small>
          {client}
          <small>{' in '}</small>
          {system}
        </Link>
      </span>
      <span className="secondary-info">
        <small>{rescue.id}{' - '}{formatAsEliteDateTime(createdAt)}{status === 'closed' ? '' : ` - ${status}`}</small>
        {
          statusIcon && (
            <span
              className="status-icon"
              title={statusIcon.text}>
              <FontAwesomeIcon fixedWidth icon={statusIcon.icon} size="2x" />
            </span>
          )
        }
      </span>
    </div>
  )
}


function ListRescues () {
  const dispatch = useDispatch()
  const rescues = useSelector((state) => {
    return selectPageViewDataById(state, { pageViewId: PAGE_VIEW_ID })
  }) ?? []

  const [client, setClient] = useState('')
  const [loading, setLoading] = useState(false)

  const runView = useCallback(async (nextClient) => {
    setLoading(true)
    await dispatch(getRescues(
      nextClient
        ? { 'client.ilike': `${nextClient}%` }
        : { 'status.ne': 'closed' },
      { pageView: PAGE_VIEW_ID },
    ))
    setLoading(false)
  }, [dispatch])

  const debouncedRunView = useMemo(() => {
    return debounce(runView, VIEW_UPDATE_DEBOUNCE_MS, { maxWait: VIEW_UPDATE_MAX_WAIT_MS })
  }, [runView])

  const handleSearchChange = useCallback((event) => {
    const nextClient = event.target.value
    setClient(nextClient)
    debouncedRunView(nextClient)
  }, [debouncedRunView])

  const handleRefreshClick = useCallback(() => {
    runView(client)
  }, [runView, client])

  return (
    <div className="page-content">
      <div className="search-controls">
        <button
          className="inline"
          type="button"
          onClick={handleRefreshClick}>
          <FontAwesomeIcon fixedWidth icon="arrows-rotate" spin={loading} />
        </button>
      </div>
      <div className="searchInput">
        <input
          aria-label="Search by client name"
          className="input"
          id="ClientNameInput"
          name="client"
          placeholder="Client Name"
          type="text"
          value={client}
          onChange={handleSearchChange} />
      </div>
      <div className="rescue-list flex column">
        {rescues.map(renderListItem)}
      </div>
    </div>
  )
}

ListRescues.getInitialProps = async ({ store }) => {
  await store.dispatch(
    getRescues(
      { 'status[ne]': 'closed' },
      { pageView: PAGE_VIEW_ID },
    ),
  )
}

ListRescues.getPageMeta = () => {
  return {
    title: 'Rescue Search',
    breadcrumbs: [{ label: 'Admin' }],
  }
}




export default authenticated('rescue.write')(ListRescues)
