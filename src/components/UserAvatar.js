import Image from 'next/image'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  selectAvatarByUserId,
  selectCurrentUserId,
} from '~/store/selectors'




/**
 * Renders a user's avatar. Tries the API image endpoint first (which
 * serves the custom avatar if one exists, server-side). Falls back to
 * the adorable-avatars deterministic image on error.
 *
 * For the current user whose data IS in the store, we add a cache-bust
 * parameter so avatar changes reflect immediately. For other users (e.g.
 * rat owners on the dispatch board) whose user objects aren't loaded, we
 * hit the API endpoint directly — it still serves the right image.
 */
function UserAvatar (props) {
  const {
    alt = "User's avatar",
    size,
    userId: userIdProp,
    ...imageProps
  } = props

  const currentUserId = useSelector(selectCurrentUserId)
  const userId = userIdProp ?? currentUserId

  // Only available for users whose data is in the store (typically the
  // current user). Used purely as a cache-bust so avatar uploads reflect
  // immediately without waiting for HTTP cache expiry.
  const avatarData = useSelector((state) => {
    return userId ? selectAvatarByUserId(state, { userId }) : undefined
  })

  const [hasError, setHasError] = useState(false)

  // Always try the API image endpoint — it serves the custom avatar
  // server-side regardless of whether we have the user in the store.
  const src = userId
    ? `/api/fr/users/${userId}/image?size=${size}${avatarData?.id ? `&v=${avatarData.id}` : ''}`
    : undefined

  useEffect(() => {
    setHasError(false)
  }, [src])

  const handleError = useCallback(() => {
    setHasError(true)
  }, [])

  if (!src || !userId) {
    return null
  }

  const fallback = `/api/avatars/${userId}/${size}`
  const resolvedSrc = hasError ? fallback : src

  return (
    <Image
      alt={alt}
      height={size}
      src={resolvedSrc}
      unoptimized
      width={size}
      {...imageProps}
      onError={handleError} />
  )
}

UserAvatar.propTypes = {
  alt: PropTypes.string,
  size: PropTypes.number.isRequired,
  userId: PropTypes.string,
}




export default UserAvatar
