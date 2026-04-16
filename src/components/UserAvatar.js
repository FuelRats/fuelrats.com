import Image from 'next/image'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  selectAvatarUrlByUserId,
  selectCurrentUserId,
} from '~/store/selectors'




/**
 * Renders a user's avatar. If the custom avatar image fails to load
 * (missing, API error, etc.) we fall back to the adorable-avatars image
 * generated from their user ID, so users never see a broken-image icon.
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

  const src = useSelector((state) => {
    return userId ? selectAvatarUrlByUserId(state, { userId, size }) : undefined
  })

  const [hasError, setHasError] = useState(false)

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
