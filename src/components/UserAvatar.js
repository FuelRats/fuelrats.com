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
 * For users in the Redux store, uses the selector-based URL.
 * For users not in the store, tries the API image endpoint, falling back on error.
 * @param {object} props - Component props.
 * @returns {import('react').ReactElement|null} The rendered avatar or null.
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

  // Check if the store has avatar relationship data for this user.
  // A user may be in the store from a partial API response (e.g.
  // included via a rat relationship) without avatar data.
  const hasAvatarData = useSelector((state) => {
    if (!userId || !userInStore) {
      return false
    }
    const user = selectUserById(state, { userId })
    return user?.relationships?.avatar !== undefined
  })

  // When avatar data is in the store, use the selector URL.
  // Otherwise try the API image endpoint directly.
  const storeUrl = useSelector((state) => {
    return (userId && hasAvatarData)
      ? selectAvatarUrlByUserId(state, { userId, size: fetchSize })
      : undefined
  })

  const apiUrl = (!hasAvatarData && userId)
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
      unoptimized
      alt={alt}
      height={size}
      src={resolvedSrc}
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
