import PropTypes from 'prop-types'
import {
  useCallback, useEffect, useMemo, useState,
} from 'react'
import { useDispatch } from 'react-redux'

import {
  FLAG_CATEGORIES,
  FLAG_ORDER,
  describeFlags,
  isValidFlags,
} from '~/data/groupChannelFlags'
import { setGroupChannel, removeGroupChannel, getRegisteredChannels } from '~/store/actions/groups'
import getResponseError from '~/util/getResponseError'

import ConfirmActionButton from '../ConfirmActionButton'
import TagsInput from '../TagsInput'
import styles from './GroupAdmin.module.scss'





// Assemble the checked letters into a flag string in the catalog's canonical order.
const assembleFlags = (checked) => {
  return FLAG_ORDER.filter((letter) => {
    return checked.has(letter)
  }).join('')
}


function ChannelFlagPicker (props) {
  const {
    initialChannel = '',
    initialFlags = '',
    isNew,
    registeredChannels,
    onSave,
    onCancel,
  } = props

  const [channel, setChannel] = useState(initialChannel)
  const [checked, setChecked] = useState(() => {
    return new Set(Array.from(initialFlags))
  })
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  // Stable array identity so a flag toggle (parent re-render) doesn't churn TagsInput's value sync.
  const channelValue = useMemo(() => {
    return channel ? [channel] : []
  }, [channel])

  // TagsInput single-select: onAdd/onRemove pass the tag directly and fire
  // reliably (onChange's array arg races React's lazy state update).
  const handleChannelAdd = useCallback((tag) => {
    setChannel(tag?.value ?? '')
  }, [])

  const handleChannelRemove = useCallback(() => {
    setChannel('')
  }, [])

  // Suggest registered channels, matching with or without the leading `#`.
  const handleChannelSearch = useCallback((query) => {
    const needle = query.replace(/^#/u, '').toLowerCase()
    return registeredChannels.filter((name) => {
      return name.replace(/^#/u, '').toLowerCase().includes(needle)
    })
  }, [registeredChannels])

  const handleToggle = useCallback((letter) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(letter)) {
        next.delete(letter)
      } else {
        next.add(letter)
      }
      return next
    })
  }, [])

  const handleSave = useCallback(async () => {
    const bareKey = channel.replace(/^[#&]/u, '').trim()
    if (!bareKey) {
      setError('Enter a channel name.')
      return
    }
    const flags = assembleFlags(checked)
    if (!flags) {
      setError('Select at least one flag.')
      return
    }
    if (!isValidFlags(flags)) {
      setError('One or more flags are invalid.')
      return
    }
    setSaving(true)
    setError(null)
    const saveError = await onSave(bareKey, flags)
    setSaving(false)
    if (saveError) {
      setError(saveError)
    }
  }, [channel, checked, onSave])

  return (
    <div className={styles.picker}>
      <label className={styles.flagCheck}>
        {'Channel'}
        {
          isNew
            ? (
              <TagsInput
                data-allownew
                data-single
                aria-label="Channel name"
                placeholder="#channel"
                value={channelValue}
                valueProp="value"
                onAdd={handleChannelAdd}
                onRemove={handleChannelRemove}
                onSearch={handleChannelSearch} />
            )
            : (
              <input
                disabled
                readOnly
                aria-label="Channel name"
                type="text"
                value={`#${channel.replace(/^#/u, '')}`} />
            )
        }
      </label>

      <div className={styles.flagCategories}>
        {
          FLAG_CATEGORIES.map((category) => {
            return (
              <fieldset key={category.key} className={styles.flagCategory}>
                <legend>{category.label}</legend>
                {
                  category.flags.map((flag) => {
                    return (
                      <label key={flag.letter} className={styles.flagCheck} title={flag.description}>
                        <input
                          aria-label={flag.label}
                          checked={checked.has(flag.letter)}
                          type="checkbox"
                          onChange={
                            () => {
                              return handleToggle(flag.letter)
                            }
                          } />
                        <span>
                          {flag.label}
                          <span className={styles.flagCheckDesc}>{flag.description}</span>
                        </span>
                      </label>
                    )
                  })
                }
              </fieldset>
            )
          })
        }
      </div>

      {Boolean(error) && (<p className={styles.error}>{error}</p>)}

      <div className={styles.pickerActions}>
        <button
          className="green compact"
          disabled={saving}
          type="button"
          onClick={handleSave}>
          {saving ? 'Saving...' : 'Save channel'}
        </button>
        <button
          className="compact"
          type="button"
          onClick={onCancel}>
          {'Cancel'}
        </button>
      </div>
    </div>
  )
}

ChannelFlagPicker.propTypes = {
  initialChannel: PropTypes.string,
  initialFlags: PropTypes.string,
  isNew: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  registeredChannels: PropTypes.arrayOf(PropTypes.string).isRequired,
}





function GroupChannelsSection ({ group }) {
  const dispatch = useDispatch()
  const channels = group.attributes.channels ?? {}
  // `editing` is null (closed), '' (adding new), or a bare channel key (editing existing).
  const [editing, setEditing] = useState(null)
  const [registeredChannels, setRegisteredChannels] = useState([])

  useEffect(() => {
    let active = true
    dispatch(getRegisteredChannels()).then((response) => {
      if (active && Array.isArray(response.payload?.channels)) {
        setRegisteredChannels(response.payload.channels)
      }
    })
    return () => {
      active = false
    }
  }, [dispatch])

  const channelEntries = useMemo(() => {
    return Object.entries(group.attributes.channels ?? {}).sort(([keyA], [keyB]) => {
      return keyA.localeCompare(keyB)
    })
  }, [group.attributes.channels])

  const handleSave = useCallback(async (bareKey, flags) => {
    const response = await dispatch(setGroupChannel(group.id, bareKey, flags))
    const err = getResponseError(response)
    if (err) {
      return err.detail ?? 'Failed to save channel.'
    }
    setEditing(null)
    return null
  }, [dispatch, group.id])

  const handleRemove = useCallback(async (bareKey) => {
    const response = await dispatch(removeGroupChannel(group.id, bareKey))
    const err = getResponseError(response)
    return !err
  }, [dispatch, group.id])

  const handleAddNew = useCallback(() => {
    setEditing('')
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditing(null)
  }, [])

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{'Channel access'}</h3>
      <p className={styles.sectionHint}>
        {'IRC channels this group grants access to, with the privileges applied on join.'}
      </p>

      <div className={styles.channelList}>
        {
          channelEntries.length === 0 && (
            <p className={styles.sectionHint}>{'No channels configured.'}</p>
          )
        }
        {
          channelEntries.map(([bareKey, flags]) => {
            return (
              <div key={bareKey} className={styles.channelRow}>
                <span className={styles.channelName}>{`#${bareKey}`}</span>
                <span className={styles.flagBadges}>
                  {
                    describeFlags(flags).map((label, index) => {
                      // eslint-disable-next-line react/no-array-index-key -- flag order is stable per render
                      return (<span key={`${bareKey}-${index}`} className={styles.flagBadge}>{label}</span>)
                    })
                  }
                </span>
                <span className={styles.rowActions}>
                  <button
                    aria-label={`Edit #${bareKey}`}
                    className="compact"
                    type="button"
                    onClick={
                      () => {
                        return setEditing(bareKey)
                      }
                    }>
                    {'Edit'}
                  </button>
                  <ConfirmActionButton
                    aria-label={`Remove #${bareKey}`}
                    confirmButtonText="Remove"
                    onConfirm={
                      () => {
                        return handleRemove(bareKey)
                      }
                    }>
                    {'Remove'}
                  </ConfirmActionButton>
                </span>
              </div>
            )
          })
        }
      </div>

      {
        editing === null
          ? (
            <button
              className="compact"
              type="button"
              onClick={handleAddNew}>
              {'Add channel'}
            </button>
          )
          : (
            <ChannelFlagPicker
              key={editing || 'new'}
              initialChannel={editing}
              initialFlags={editing ? (channels[editing] ?? '') : ''}
              isNew={editing === ''}
              registeredChannels={registeredChannels}
              onCancel={handleCancelEdit}
              onSave={handleSave} />
          )
      }
    </section>
  )
}

GroupChannelsSection.propTypes = {
  group: PropTypes.object.isRequired,
}





export default GroupChannelsSection
