import PropTypes from 'prop-types'

import UserAvatar from './UserAvatar'




/**
 * Renders a rat's name with a small inline user avatar.
 * Unidentified rats (no user relationship) get no avatar and italic text.
 */
function RatName ({ rat, size = 18, children }) {
  const userId = rat?.relationships?.user?.data?.id
  const name = rat?.attributes?.name ?? ''
  const isUnidentified = rat?.type === 'unidentified-rats'

  if (isUnidentified) {
    return (<i title="This rat is unidentified">{`${name}*`}</i>)
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35em' }}>
      {userId && (
        <UserAvatar
          alt=""
          size={size}
          style={{ borderRadius: '50%', verticalAlign: 'middle', flexShrink: 0 }}
          userId={userId} />
      )}
      <span>{name}</span>
      {children}
    </span>
  )
}

RatName.propTypes = {
  children: PropTypes.node,
  rat: PropTypes.object.isRequired,
  size: PropTypes.number,
}




export default RatName
