import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'

import { expansionNameMap } from '~/util/expansion'

import styles from './PlatformBadge.module.scss'


function PlatformBadge ({ platform, expansion, className }) {
  if (!platform) {
    return null
  }

  let icon = null
  let label = null

  if (platform === 'pc') {
    icon = <FontAwesomeIcon fixedWidth icon="tv" />
    label = expansion ? (expansionNameMap[expansion] ?? 'PC') : 'PC'
  } else if (platform === 'ps') {
    icon = <FontAwesomeIcon fixedWidth icon={['fab', 'playstation']} />
    label = 'PS'
  } else if (platform === 'xb') {
    icon = <FontAwesomeIcon fixedWidth icon={['fab', 'xbox']} />
    label = 'XB'
  } else {
    label = platform.toUpperCase()
  }

  return (
    <span className={clsx(styles.platformBadge, className)}>
      <span className={styles.platformBadgeIcon}>{icon}</span>
      <span className={clsx(styles.platformBadgeLabel, platform, expansion)}>
        {label}
      </span>
    </span>
  )
}

export default PlatformBadge
