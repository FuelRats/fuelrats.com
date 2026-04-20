import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import {
  useCallback, useEffect, useMemo, useReducer, useRef, useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { authenticated } from '~/components/AppLayout'
import ConfirmActionButton from '~/components/ConfirmActionButton'
import CopyToClipboard from '~/components/CopyToClipboard'
import Pagination from '~/components/Pagination'
import PlatformBadge from '~/components/PlatformBadge'
import RatTagsInput from '~/components/RatTagsInput'
import SearchFilterPanel from '~/components/SearchFilterPanel'
import TagsInput from '~/components/TagsInput'
import UserAvatar from '~/components/UserAvatar'
import {
  USER_SORT_OPTIONS,
  initialUserFilters,
  userFilterReducer,
  buildUserFilterParams,
  getUserFilterFields,
} from '~/components/UserSearch/userFilterConfig'
import useDebouncedCallback from '~/hooks/useDebouncedCallback'
import {
  getUsers,
  searchNicknames,
  adminUpdateUser,
  adminAddGroups,
  adminRemoveGroups,
  adminRemoveTotp,
  adminResetPassword,
} from '~/store/actions/user'
import {
  selectPageViewDataById, selectPageViewMetaById,
  selectGroups, selectGroupsByUserId,
  selectRatsByUserId, selectNicknamesByUserId,
} from '~/store/selectors'
import formatAsEliteDateTime from '~/util/date/formatAsEliteDateTime'
import getRatTag from '~/util/getRatTag'
import getResponseError from '~/util/getResponseError'

import styles from './AdminUsers.module.scss'
import { SuspendModal, ResetPasswordModal, EditRatsModal, EditNicksModal } from './UserAdminModals'



const PAGE_VIEW_ID = 'admin-users'
const PAGE_SIZE = 25
const SEARCH_DEBOUNCE_MS = 500
const SHORT_ID_LENGTH = 8
const PERMANENT_SUSPENSION_YEAR = 2100

const SEARCH_FIELD = { field: 'email', placeholder: 'Search by email...', label: 'Search by email' }

const statusLabels = {
  active: { label: 'Active', className: styles.statusActive },
  inactive: { label: 'Inactive', className: styles.statusInactive },
  legacy: { label: 'Legacy', className: styles.statusLegacy },
  deactivated: { label: 'Deactivated', className: styles.statusDeactivated },
}

const STATUS_CHANGE_OPTIONS = ['active', 'inactive', 'legacy', 'deactivated']

const groupConfig = {
  verified: { color: '#918f8f', icon: 'circle-check' },
  rat: { color: '#49c549', icon: 'graduation-cap' },
  dispatch: { color: '#1e711e', icon: 'headset' },
  overseer: { color: '#df8122', icon: 'eye' },
  moderator: { color: '#d15656', icon: 'gavel' },
  trainer: { color: '#ffb366', icon: 'chalkboard-user' },
  techrat: { color: '#5d93b9', icon: 'gears' },
  netadmin: { color: '#276a99', icon: 'gears' },
  admin: { color: '#aa2020', icon: 'gavel' },
  owner: { color: '#89308c', icon: 'snowflake' },
  developer: { color: '#92b1c7', icon: 'code' },
  operations: { color: '#bb88ff', icon: 'clipboard-list' },
  merchant: { color: '#b883ba', icon: 'bag-shopping' },
}


function formatSuspension (suspended) {
  if (!suspended) {
    return null
  }
  const date = new Date(suspended)
  if (date.getFullYear() >= PERMANENT_SUSPENSION_YEAR) {
    return 'Permanent'
  }
  if (date > new Date()) {
    return formatAsEliteDateTime(suspended)
  }
  return null
}


function GroupBadge ({ group }) {
  const config = groupConfig[group.attributes.name]
  return (
    <span
      className={styles.groupBadge}
      style={config ? { backgroundColor: config.color } : undefined}>
      {config?.icon && (<FontAwesomeIcon fixedWidth icon={config.icon} />)}
      {group.attributes.displayName ?? group.attributes.name}
    </span>
  )
}

function renderGroupValue (group) {
  const config = groupConfig[group.attributes?.name]
  return (
    <span className={styles.groupBadgeInline}>
      {config?.icon && (<FontAwesomeIcon fixedWidth icon={config.icon} />)}
      {group.attributes?.displayName ?? group.attributes?.name ?? ''}
    </span>
  )
}

function getGroupTagStyle (group) {
  const config = groupConfig[group.attributes?.name]
  return config ? { backgroundColor: config.color, color: 'white', borderRadius: '4px' } : undefined
}

function getGroupOptionStyle (group) {
  const config = groupConfig[group.attributes?.name]
  return config ? { backgroundColor: config.color, color: 'white' } : undefined
}


// Inline editable email cell
function EditableEmailCell ({ user, onSave }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(user.attributes.email)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
    }
  }, [editing])

  const handleSave = useCallback(async () => {
    const trimmed = value.trim()
    if (trimmed && trimmed !== user.attributes.email) {
      await onSave(user.id, { email: trimmed })
    }
    setEditing(false)
  }, [value, user, onSave])

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      handleSave()
    } else if (event.key === 'Escape') {
      setValue(user.attributes.email)
      setEditing(false)
    }
  }, [handleSave, user.attributes.email])

  if (editing) {
    return (
      <td className={styles.email}>
        <input
          ref={inputRef}
          aria-label="Edit email"
          className={styles.inlineInput}
          type="email"
          value={value}
          onBlur={handleSave}
          onChange={
            (event) => {
              return setValue(event.target.value)
            }
          }
          onKeyDown={handleKeyDown} />
      </td>
    )
  }

  return (
    <td
      className={clsx(styles.email, styles.clickable)}
      title="Click to edit"
      onClick={
        () => {
          return setEditing(true)
        }
      }>
      {user.attributes.email}
    </td>
  )
}


// Inline editable status cell
function EditableStatusCell ({ user, onSave }) {
  const [editing, setEditing] = useState(false)
  const selectRef = useRef(null)

  useEffect(() => {
    if (editing) {
      selectRef.current?.focus()
    }
  }, [editing])

  const handleChange = useCallback(async (event) => {
    await onSave(user.id, { status: event.target.value })
    setEditing(false)
  }, [user.id, onSave])

  const statusInfo = statusLabels[user.attributes.status]

  if (editing) {
    return (
      <td>
        <select
          ref={selectRef}
          className={styles.inlineSelect}
          value={user.attributes.status}
          onBlur={
            () => {
              return setEditing(false)
            }
          }
          onChange={handleChange}>
          {
            STATUS_CHANGE_OPTIONS.map((st) => {
              return <option key={st} value={st}>{st}</option>
            })
          }
        </select>
      </td>
    )
  }

  return (
    <td
      className={styles.clickable}
      title="Click to change"
      onClick={
        () => {
          return setEditing(true)
        }
      }>
      {
        statusInfo && (
          <span className={clsx(styles.statusBadge, statusInfo.className)}>
            {statusInfo.label}
          </span>
        )
      }
    </td>
  )
}


// Inline editable groups cell
function EditableGroupsCell ({ userId, onAdd, onRemove }) {
  const [editing, setEditing] = useState(false)
  const [localGroups, setLocalGroups] = useState(null)
  const groups = useSelector((state) => {
    return selectGroupsByUserId(state, { userId })
  })
  const allGroups = useSelector(selectGroups)
  const containerRef = useRef(null)
  const originalIdsRef = useRef(null)

  const handleOpen = useCallback(() => {
    const current = groups ?? []
    setLocalGroups(current)
    originalIdsRef.current = new Set(current.map((group) => {
      return group.id
    }))
    setEditing(true)
  }, [groups])

  const handleSave = useCallback(async () => {
    setEditing(false)
    if (!localGroups || !originalIdsRef.current) {
      return
    }
    const originalIds = originalIdsRef.current
    const currentIds = new Set(localGroups.map((group) => {
      return group.id
    }))

    const toAdd = localGroups.filter((group) => {
      return !originalIds.has(group.id)
    }).map((group) => {
      return group.id
    })
    const toRemove = [...originalIds].filter((id) => {
      return !currentIds.has(id)
    })

    if (toAdd.length > 0) {
      await onAdd(userId, toAdd)
    }
    if (toRemove.length > 0) {
      await onRemove(userId, toRemove)
    }
  }, [localGroups, userId, onAdd, onRemove])

  useEffect(() => {
    if (!editing) {
      return undefined
    }
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        handleSave()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [editing, handleSave])

  const handleGroupSearch = useCallback((query) => {
    const allGroupsList = Object.values(allGroups)
    if (!query) {
      return allGroupsList
    }
    const lower = query.toLowerCase()
    return allGroupsList.filter((group) => {
      return group.attributes.name.toLowerCase().includes(lower)
    })
  }, [allGroups])

  const handleChange = useCallback((nextGroups) => {
    setLocalGroups(nextGroups)
  }, [])

  if (editing) {
    return (
      <td>
        <div ref={containerRef} className={styles.groupsEditCell}>
          <TagsInput
            aria-label="Edit groups"
            optionClassName={styles.groupOption}
            optionStyle={getGroupOptionStyle}
            placeholder="Add group..."
            renderValue={renderGroupValue}
            tagClassName={styles.groupTagItem}
            tagStyle={getGroupTagStyle}
            value={localGroups}
            valueProp="attributes.name"
            onChange={handleChange}
            onSearch={handleGroupSearch} />
        </div>
      </td>
    )
  }

  return (
    <td
      className={styles.clickable}
      title="Click to edit"
      onClick={handleOpen}>
      <div className={styles.groupsCell}>
        {
          groups?.map((group) => {
            return <GroupBadge key={group.id} group={group} />
          })
        }
        {(!groups || groups.length === 0) && '-'}
      </div>
    </td>
  )
}




function UserRatsCell ({ userId, onEdit }) {
  const rats = useSelector((state) => {
    return selectRatsByUserId(state, { userId })
  })
  if (!rats || rats.length === 0) {
    return (
      <td
        className={styles.clickable}
        title="Click to edit rats"
        onClick={onEdit}>
        {'-'}
      </td>
    )
  }
  return (
    <td
      className={clsx(styles.rats, styles.clickable)}
      title="Click to edit rats"
      onClick={onEdit}>
      {
        rats.map((rat) => {
          return (
            <div key={rat.id} className={styles.ratEntry}>
              <PlatformBadge className={styles.smallBadge} expansion={rat.attributes.expansion} platform={rat.attributes.platform} />
              {rat.attributes.name}
            </div>
          )
        })
      }
    </td>
  )
}


function UserNicksCell ({ userId, onEdit }) {
  const nicks = useSelector((state) => {
    return selectNicknamesByUserId(state, { userId })
  })
  const filtered = nicks?.filter(Boolean)
  if (!filtered || filtered.length === 0) {
    return (
      <td
        className={clsx(styles.nicks, styles.clickable)}
        title="Click to edit nicks"
        onClick={onEdit}>
        {'-'}
      </td>
    )
  }
  return (
    <td
      className={clsx(styles.nicks, styles.clickable)}
      title="Click to edit nicks"
      onClick={onEdit}>
      {
        filtered.map((nick) => {
          return (
            <div key={nick.id}>
              {nick.attributes?.nick ?? nick.attributes?.name}
            </div>
          )
        })
      }
    </td>
  )
}


function useQueryPage () {
  const router = useRouter()
  const [page, setPage] = useState(1)

  useEffect(() => {
    const handleRouteChange = (url) => {
      const match = url.match(/[?&]rpage=(\d+)/u)
      setPage(match ? Math.max(Number(match[1]), 1) : 1)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return page
}


function AdminUsers () {
  const dispatch = useDispatch()
  const page = useQueryPage()
  const offset = (page - 1) * PAGE_SIZE
  const [fetchError, setFetchError] = useState(false)
  const [filters, setFilter] = useReducer(userFilterReducer, initialUserFilters)
  const [debouncedFilters, setDebouncedFilters] = useState(initialUserFilters)
  const [showFilters, setShowFilters] = useState(false)
  const [suspendUserId, setSuspendUserId] = useState(null)
  const [resetPasswordUserId, setResetPasswordUserId] = useState(null)
  const [editRatsUserId, setEditRatsUserId] = useState(null)
  const [editNicksUserId, setEditNicksUserId] = useState(null)
  const [filterRat, setFilterRat] = useState(null)
  const [filterGroups, setFilterGroups] = useState([])
  const allGroups = useSelector(selectGroups)

  const applyFilters = useDebouncedCallback((nextFilters) => {
    setDebouncedFilters(nextFilters)
  }, [], SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    applyFilters(filters)
  }, [filters, applyFilters])

  const isNicknameSearch = Boolean(debouncedFilters.nickname?.trim())

  const pageViewData = useSelector((state) => {
    return selectPageViewDataById(state, { pageViewId: PAGE_VIEW_ID })
  })
  const meta = useSelector((state) => {
    return selectPageViewMetaById(state, { pageViewId: PAGE_VIEW_ID })
  })

  // When doing nickname search, pageView contains nicknames — extract linked users
  const users = useSelector((state) => {
    if (!isNicknameSearch) {
      return pageViewData
    }
    if (!pageViewData) {
      return null
    }
    const seen = new Set()
    return pageViewData
      .map((nick) => {
        const userId = nick.relationships?.user?.data?.id
        if (!userId || seen.has(userId)) {
          return null
        }
        seen.add(userId)
        return state.users[userId]
      })
      .filter(Boolean)
  })

  const handleRatFilterChange = useCallback((rats) => {
    setFilterRat(rats?.[0] ?? null)
  }, [])

  const handleGroupFilterChange = useCallback((groups) => {
    setFilterGroups(groups ?? [])
  }, [])

  const handleGroupFilterSearch = useCallback((query) => {
    const allGroupsList = Object.values(allGroups)
    if (!query) {
      return allGroupsList
    }
    const lower = query.toLowerCase()
    return allGroupsList.filter((group) => {
      return group.attributes.name.toLowerCase().includes(lower)
    })
  }, [allGroups])

  const fetchUsersData = useCallback(() => {
    setFetchError(false)

    if (isNicknameSearch) {
      const nickParams = {
        filter: { nick: { iLike: `%${debouncedFilters.nickname.trim()}%` } },
      }
      return Promise.resolve(dispatch(searchNicknames(
        nickParams,
        {
          pageView: {
            id: PAGE_VIEW_ID,
            type: 'nicknames',
          },
        },
      ))).then((result) => {
        if (result?.error) {
          setFetchError(true)
        }
      })
    }

    const params = buildUserFilterParams(debouncedFilters, offset, PAGE_SIZE)
    if (filterRat) {
      params._rats = filterRat.id
    }
    if (filterGroups.length > 0) {
      params._groups = filterGroups.map((group) => {
        return group.attributes.name
      }).join(',')
    }
    return Promise.resolve(dispatch(getUsers(
      params,
      {
        pageView: {
          id: PAGE_VIEW_ID,
          type: 'users',
        },
      },
    ))).then((result) => {
      if (result?.error) {
        setFetchError(true)
      }
    })
  }, [dispatch, offset, debouncedFilters, filterRat, filterGroups, isNicknameSearch])

  useEffect(() => {
    fetchUsersData()
  }, [fetchUsersData])

  const handleFilterChange = useCallback((field, value) => {
    setFilter({ field, value })
  }, [])

  const handleResetFilters = useCallback(() => {
    setFilter({ type: 'reset' })
    setFilterRat(null)
    setFilterGroups([])
  }, [])

  const handleToggleFilters = useCallback(() => {
    setShowFilters((prev) => {
      return !prev
    })
  }, [])

  const handleSaveField = useCallback(async (userId, attrs) => {
    const response = await dispatch(adminUpdateUser({
      id: userId,
      attributes: attrs,
    }))
    const err = getResponseError(response)
    if (err) {
      return err.detail ?? 'Failed to save.'
    }
    fetchUsersData()
    return null
  }, [dispatch, fetchUsersData])

  const handleSuspend = useCallback(async (userId, attrs) => {
    const response = await dispatch(adminUpdateUser({
      id: userId,
      attributes: attrs,
    }))
    const err = getResponseError(response)
    if (err) {
      return err.detail ?? 'Failed to suspend.'
    }
    fetchUsersData()
    return null
  }, [dispatch, fetchUsersData])

  const handleResetPasswordSave = useCallback(async (userId, newPassword) => {
    const response = await dispatch(adminResetPassword(userId, newPassword))
    const err = getResponseError(response)
    if (err) {
      return err.detail ?? 'Failed to reset password.'
    }
    return null
  }, [dispatch])

  const handleUnsuspend = useCallback(async (userId) => {
    await dispatch(adminUpdateUser({
      id: userId,
      attributes: { suspended: null },
    }))
    fetchUsersData()
    return true
  }, [dispatch, fetchUsersData])

  const handleRemoveTotp = useCallback(async (userId) => {
    const response = await dispatch(adminRemoveTotp(userId))
    const err = getResponseError(response)
    if (err) {
      return false
    }
    fetchUsersData()
    return true
  }, [dispatch, fetchUsersData])

  const handleAddGroup = useCallback(async (userId, groupIds) => {
    await dispatch(adminAddGroups(userId, groupIds))
    fetchUsersData()
  }, [dispatch, fetchUsersData])

  const handleRemoveGroup = useCallback(async (userId, groupIds) => {
    await dispatch(adminRemoveGroups(userId, groupIds))
    fetchUsersData()
  }, [dispatch, fetchUsersData])

  const { fields: baseFields, footerFields } = useMemo(() => {
    return getUserFilterFields()
  }, [])

  const [nicknameField] = baseFields

  const fields = useMemo(() => {
    if (isNicknameSearch) {
      return [nicknameField]
    }
    return [
      ...baseFields,
      {
        type: 'custom',
        render: () => {
          return (
            <div key="relationship-filters" className={styles.relationshipFilters}>
              <label className={styles.filterField}>
                <span>{'Group'}</span>
                <TagsInput
                  aria-label="Filter by group"
                  optionClassName={styles.groupOption}
                  optionStyle={getGroupOptionStyle}
                  placeholder="Filter by group..."
                  renderValue={renderGroupValue}
                  tagClassName={styles.groupTagItem}
                  tagStyle={getGroupTagStyle}
                  value={filterGroups}
                  valueProp="attributes.name"
                  onChange={handleGroupFilterChange}
                  onSearch={handleGroupFilterSearch} />
              </label>
              <label className={styles.filterField}>
                <span>{'Rat'}</span>
                <RatTagsInput
                  data-single
                  aria-label="Filter by rat"
                  placeholder="Search rat name..."
                  value={filterRat ? [filterRat] : []}
                  valueProp={getRatTag}
                  onChange={handleRatFilterChange} />
              </label>
            </div>
          )
        },
      },
    ]
  }, [baseFields, nicknameField, isNicknameSearch, filterGroups, filterRat, handleGroupFilterChange, handleGroupFilterSearch, handleRatFilterChange])

  const total = meta?.total ?? meta?.count ?? 0
  let totalPages = page
  if (total) {
    totalPages = Math.ceil(total / PAGE_SIZE)
  } else if (users?.length === PAGE_SIZE) {
    totalPages = page + 1
  }

  const handleRefresh = fetchUsersData

  const handleGenerateRoute = useCallback(({ page: nextPage }) => {
    return nextPage > 1 ? `/admin/users?rpage=${nextPage}` : '/admin/users'
  }, [])

  return (
    <div className="page-content">
      <SearchFilterPanel
        fields={fields}
        filters={filters}
        footerFields={isNicknameSearch ? [] : footerFields}
        searchField={SEARCH_FIELD}
        showFilters={showFilters}
        sortOptions={isNicknameSearch ? null : USER_SORT_OPTIONS}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onToggleFilters={handleToggleFilters} />

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th />
              <th>{'Email'}</th>
              <th>{'Rats'}</th>
              <th>{'IRC Nicks'}</th>
              <th>{'Groups'}</th>
              <th>{'Status'}</th>
              <th>{'Suspended'}</th>
              <th>{'Created'}</th>
              <th>{'Updated'}</th>
              <th>{'ID'}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {
              (!users || users.length === 0) && (
                <tr>
                  <td className={styles.empty} colSpan={11}>
                    {fetchError && 'Failed to load users.'}
                    {!fetchError && users && 'No users found.'}
                    {!fetchError && !users && 'Loading...'}
                  </td>
                </tr>
              )
            }
            {
              users?.map((user) => {
                const { suspended, createdAt, updatedAt, status } = user.attributes
                const suspendedDisplay = formatSuspension(suspended)
                const shortId = user.id.slice(0, SHORT_ID_LENGTH)
                const has2fa = Boolean(user.relationships?.authenticator?.data)

                return (
                  <tr
                    key={user.id}
                    className={
                      clsx(styles.userRow, {
                        [styles.suspendedRow]: suspendedDisplay,
                        [styles.deactivatedRow]: status === 'deactivated',
                      })
                    }>
                    <td className={styles.avatarCell}>
                      <UserAvatar size={40} userId={user.id} />
                    </td>
                    <EditableEmailCell user={user} onSave={handleSaveField} />
                    <UserRatsCell
                      userId={user.id}
                      onEdit={
                        () => {
                          return setEditRatsUserId(user.id)
                        }
                      } />
                    <UserNicksCell
                      userId={user.id}
                      onEdit={
                        () => {
                          return setEditNicksUserId(user.id)
                        }
                      } />
                    <EditableGroupsCell
                      userId={user.id}
                      onAdd={handleAddGroup}
                      onRemove={handleRemoveGroup} />
                    <EditableStatusCell user={user} onSave={handleSaveField} />
                    <td
                      className={clsx({ [styles.clickable]: !suspendedDisplay })}
                      title={suspendedDisplay ? 'Click to unsuspend' : 'Click to suspend'}
                      onClick={
                        () => {
                          if (suspendedDisplay) {
                            return handleUnsuspend(user.id)
                          }
                          return setSuspendUserId(user.id)
                        }
                      }>
                      {
                        suspendedDisplay
                          ? (<span className={styles.suspendedBadge}>{suspendedDisplay}</span>)
                          : (<span className={styles.notSuspended}>{'-'}</span>)
                      }
                    </td>
                    <td className={styles.date}>
                      {formatAsEliteDateTime(createdAt)}
                    </td>
                    <td className={styles.date}>
                      {formatAsEliteDateTime(updatedAt)}
                    </td>
                    <CopyToClipboard as="td" className={styles.idCell} text={user.id}>
                      <code title={user.id}>{shortId}</code>
                    </CopyToClipboard>
                    <td className={styles.actionsCell}>
                      {
                        has2fa && (
                          <ConfirmActionButton
                            className={clsx('compact', styles.actionButton)}
                            confirmButtonText="Remove 2FA"
                            confirmSubText="Remove this user's 2FA?"
                            denyButtonText="Cancel"
                            name={user.id}
                            onConfirm={
                              () => {
                                return handleRemoveTotp(user.id)
                              }
                            }
                            onConfirmText="">
                            <FontAwesomeIcon fixedWidth icon="lock" title="Remove 2FA" />
                          </ConfirmActionButton>
                        )
                      }
                      <button
                        className={clsx('compact', styles.actionButton)}
                        title="Reset password"
                        type="button"
                        onClick={
                          () => {
                            return setResetPasswordUserId(user.id)
                          }
                        }>
                        <FontAwesomeIcon fixedWidth icon="key" />
                      </button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>

      {
        total > 0 && (
          <div className={styles.footer}>
            <span>{`${total} user${total === 1 ? '' : 's'}`}</span>
          </div>
        )
      }

      {
        totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onGenerateRoute={handleGenerateRoute} />
        )
      }

      <SuspendModal
        isOpen={Boolean(suspendUserId)}
        userId={suspendUserId}
        onClose={
          () => {
            return setSuspendUserId(null)
          }
        }
        onSave={handleSuspend} />

      <ResetPasswordModal
        isOpen={Boolean(resetPasswordUserId)}
        userId={resetPasswordUserId}
        onClose={
          () => {
            return setResetPasswordUserId(null)
          }
        }
        onSave={handleResetPasswordSave} />

      <EditRatsModal
        isOpen={Boolean(editRatsUserId)}
        userId={editRatsUserId}
        onClose={
          () => {
            return setEditRatsUserId(null)
          }
        }
        onRefresh={handleRefresh} />

      <EditNicksModal
        isOpen={Boolean(editNicksUserId)}
        userId={editNicksUserId}
        onClose={
          () => {
            return setEditNicksUserId(null)
          }
        }
        onRefresh={handleRefresh} />
    </div>
  )
}

AdminUsers.getPageMeta = () => {
  return {
    title: 'User Admin',
    breadcrumbs: [{ label: 'Admin' }],
  }
}


export default authenticated('users.write')(AdminUsers)
