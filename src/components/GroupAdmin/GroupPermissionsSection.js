import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'

import oauthScopes, { accessTypeLabel, domainLabel, scopeString } from '~/data/oauthScopes'
import { setGroupPermission, removeGroupPermission } from '~/store/actions/groups'
import getResponseError from '~/util/getResponseError'

import styles from './GroupAdmin.module.scss'





function GroupPermissionsSection ({ group }) {
  const dispatch = useDispatch()
  const permissions = group.attributes.permissions ?? []
  const permSet = new Set(permissions)
  const [error, setError] = useState(null)
  const [pending, setPending] = useState(null)

  const handleToggle = useCallback(async (scope, checked) => {
    setPending(scope)
    setError(null)
    const action = checked ? setGroupPermission : removeGroupPermission
    const response = await dispatch(action(group.id, scope))
    const err = getResponseError(response)
    setPending(null)
    if (err) {
      setError(err.detail ?? 'Failed to update permission.')
    }
  }, [dispatch, group.id])

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{'Permissions'}</h3>
      <p className={styles.sectionHint}>
        {'OAuth scopes granted to members of this group. Changes apply immediately.'}
      </p>

      {Boolean(error) && (<p className={styles.error}>{error}</p>)}

      <div className={styles.permGrid}>
        {
          Object.entries(oauthScopes).map(([domain, accessTypes]) => {
            return (
              <div key={domain} className={styles.permRow}>
                <span className={styles.permDomain}>{domainLabel(domain)}</span>
                <span className={styles.permChecks}>
                  {
                    accessTypes.map((accessType) => {
                      const scope = scopeString(domain, accessType)
                      return (
                        <label key={scope} className={styles.permCheck}>
                          <input
                            aria-label={`${domainLabel(domain)}: ${accessTypeLabel(accessType)}`}
                            checked={permSet.has(scope)}
                            disabled={pending === scope}
                            type="checkbox"
                            onChange={
                              (event) => {
                                return handleToggle(scope, event.target.checked)
                              }
                            } />
                          {accessTypeLabel(accessType)}
                        </label>
                      )
                    })
                  }
                </span>
              </div>
            )
          })
        }
      </div>
    </section>
  )
}

GroupPermissionsSection.propTypes = {
  group: PropTypes.object.isRequired,
}





export default GroupPermissionsSection
