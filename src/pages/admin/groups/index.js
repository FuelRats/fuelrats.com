import {
  useCallback, useEffect, useMemo, useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { authenticated } from '~/components/AppLayout'
import CreateGroupModal from '~/components/GroupAdmin/CreateGroupModal'
import GroupEditModal from '~/components/GroupAdmin/GroupEditModal'
import { getGroups } from '~/store/actions/user'
import { selectGroups } from '~/store/selectors'
import getResponseError from '~/util/getResponseError'

import styles from './AdminGroups.module.scss'





function AdminGroups () {
  const dispatch = useDispatch()
  const groups = useSelector(selectGroups)

  const [loadState, setLoadState] = useState('loading')
  const [editorGroupId, setEditorGroupId] = useState(null)
  const [creating, setCreating] = useState(false)

  const fetchGroups = useCallback(async () => {
    setLoadState('loading')
    const response = await dispatch(getGroups())
    setLoadState(getResponseError(response) ? 'error' : 'ready')
  }, [dispatch])

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  const groupList = useMemo(() => {
    return Object.values(groups ?? {}).sort((groupA, groupB) => {
      return (groupB.attributes.priority ?? 0) - (groupA.attributes.priority ?? 0)
        || groupA.attributes.name.localeCompare(groupB.attributes.name)
    })
  }, [groups])

  const editingGroup = editorGroupId ? groups[editorGroupId] : null

  const handleCreated = useCallback((newId) => {
    setCreating(false)
    if (newId) {
      setEditorGroupId(newId)
    }
  }, [])

  const handleOpenCreate = useCallback(() => {
    setCreating(true)
  }, [])

  const handleCloseCreate = useCallback(() => {
    setCreating(false)
  }, [])

  const handleCloseEditor = useCallback(() => {
    setEditorGroupId(null)
  }, [])

  const isEmpty = loadState === 'ready' && groupList.length === 0

  return (
    <div className="page-content">
      <div className={styles.toolbar}>
        <button
          className="green compact"
          type="button"
          onClick={handleOpenCreate}>
          {'New group'}
        </button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{'Name'}</th>
              <th>{'Display name'}</th>
              <th>{'Priority'}</th>
              <th>{'vHost'}</th>
              <th>{'Channels'}</th>
              <th>{'Scopes'}</th>
            </tr>
          </thead>
          <tbody>
            {
              (loadState === 'loading' || loadState === 'error' || isEmpty) && (
                <tr>
                  <td className={styles.empty} colSpan={6}>
                    {loadState === 'loading' && 'Loading...'}
                    {loadState === 'error' && 'Failed to load groups.'}
                    {isEmpty && 'No groups found.'}
                  </td>
                </tr>
              )
            }
            {
              groupList.map((group) => {
                const {
                  name, displayName, priority, vhost, channels, permissions,
                } = group.attributes
                return (
                  <tr
                    key={group.id}
                    className={styles.clickable}
                    onClick={
                      () => {
                        return setEditorGroupId(group.id)
                      }
                    }>
                    <td>{name}</td>
                    <td>{displayName}</td>
                    <td>{priority ?? 0}</td>
                    <td>{vhost || '—'}</td>
                    <td>{Object.keys(channels ?? {}).length}</td>
                    <td>{(permissions ?? []).length}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>

      <GroupEditModal
        groupId={editorGroupId}
        isOpen={Boolean(editorGroupId)}
        title={editingGroup ? `Edit ${editingGroup.attributes.name}` : 'Edit group'}
        onClose={handleCloseEditor} />

      <CreateGroupModal
        isOpen={creating}
        onClose={handleCloseCreate}
        onCreated={handleCreated} />
    </div>
  )
}

AdminGroups.getPageMeta = () => {
  return {
    title: 'Group Admin',
    breadcrumbs: [{ label: 'Admin' }],
  }
}





export default authenticated('groups.write')(AdminGroups)
