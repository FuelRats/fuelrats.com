import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import permissionNamespaces from '~/data/permissionNamespaces'

import styles from './ScopeView.module.scss'





function NamespaceDetails (props) {
  const namespace = permissionNamespaces[props.namespace]
  const { actions = {} } = props

  if (!namespace || !Object.keys(actions).length) {
    return null
  }

  const actionElements = Object.entries(actions).map(([actionName, action]) => {
    const accessible = action.all?.accessible || action.self?.accessible
    const isSelf = action.self && (!action.all || (!action.all.accessible && action.self.accessible))

    return (
      <li key={actionName} className={[styles.permission, { [styles.inaccessible]: !accessible }]}>
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

  return (
    <details open className={styles.namespace}>
      <summary className={styles.title}>
        <FontAwesomeIcon fixedWidth icon={namespace.icon} size="lg" />
        <span> <b>{namespace.text}</b></span>
      </summary>
      <ul className={styles.content}>
        {actionElements}
      </ul>
    </details>
  )
}





export default NamespaceDetails
