import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import { useMemo } from 'react'


import permissionNamespaces from '~/data/permissionNamespaces'

import styles from './ScopeView.module.scss'





function NamespaceDetails (props) {
  const namespace = permissionNamespaces[props.namespace]
  const { actions } = props

  const actionElements = useMemo(() => {
    if (!namespace || !actions || !Object.keys(actions).length) {
      return null
    }

    return Object.entries(actions).map(([actionName, action]) => {
      const accessible = action.all || action.self
      const isSelf = action.self && (!action.all || (!action.all && action.self))
      return (
        <li key={actionName} className={[styles.permission, { [styles.inaccessible]: accessible }]}>
          <span>
            {namespace.actionText[actionName]?.[isSelf ? 'self' : 'all'] ?? 'Read'}
            {' '}
            {isSelf ? 'your own' : (<b>{'ALL'}</b>)}
            {' '}
            {namespace.text}
            {!isSelf && namespace.selfSingular && 's'}
            {'.'}
          </span>
        </li>
      )
    })
  }, [actions, namespace])

  if (!actionElements) {
    return null
  }

  return (
    <details open className={styles.namespace}>
      <summary className={styles.title}>
        <FontAwesomeIcon fixedWidth icon={namespace.icon} size="lg" />
        <span><b>{namespace.text}</b></span>
      </summary>
      <ul className={styles.content}>
        {actionElements}
      </ul>
    </details>
  )
}

NamespaceDetails.propTypes = {
  actions: PropTypes.object.isRequired,
  namespace: PropTypes.string.isRequired,
}



export default NamespaceDetails
