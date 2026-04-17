import Image from 'next/image'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  selectAvatarUrlByUserId,
  selectCurrentUserId,
  selectUserById,
} from '~/store/selectors'




// The API enforces a minimum image size. We request at least this many
// pixels and let the browser downscale via width/height attributes.
const API_MIN_IMAGE_SIZE = 64


/**
 * Renders a user's avatar.
 *
 * - For users whose data IS in the Redux store (current user, etc.),
 *   uses the selector-based URL which handles custom-avatar vs adorable.
 * - For users NOT in the store (e.g. rat owners on the dispatch board),
 *   tries the API image endpoint directly, falling back to adorable on error.
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

  const fetchSize = Math.max(size, API_MIN_IMAGE_SIZE)

  // Check if this user's data is in the store
  const userInStore = useSelector((state) => {
    return userId ? Boolean(selectUserById(state, { userId })) : false
  })

  // For users in the store, the selector knows whether they have a
  // custom avatar and returns the right URL (API image or adorable).
  const storeUrl = useSelector((state) => {
    return (userId && userInStore)
      ? selectAvatarUrlByUserId(state, { userId, size: fetchSize })
      : undefined
  })

  // For users NOT in the store, try the API image endpoint directly.
  const apiUrl = (!userInStore && userId)
    ? `/api/fr/users/${userId}/image?size=${fetchSize}`
    : undefined

  const primarySrc = storeUrl ?? apiUrl

  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [primarySrc])

  const handleError = useCallback(() => {
    setHasError(true)
  }, [])

  if (!primarySrc || !userId) {
    return null
  }

  const fallback = `/api/avatars/${userId}/${fetchSize}`
  const resolvedSrc = hasError ? fallback : primarySrc

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
