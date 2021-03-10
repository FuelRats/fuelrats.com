import Link from 'next/link'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import { selectCurrentUserId } from '~/store/selectors'

/**
 * Links to a different page or external URL dependant on the user's login state.
 * @param {*} props React Props
 * @returns {Element}
 */
function AuthDependantLink (props) {
  const {
    children,
    elseExternal,
    elseHref,
    external,
    href,
  } = props

  const userId = useSelector(selectCurrentUserId)

  const destination = userId ? href : elseHref

  if ((userId && external) || (!userId && elseExternal)) {
    return (
      <a href={destination}>
        {children}
      </a>
    )
  }

  return (
    <Link href={destination}>
      <a>
        {children}
      </a>
    </Link>
  )
}


AuthDependantLink.propTypes = {
  children: PropTypes.node,
  elseExternal: PropTypes.bool,
  elseHref: PropTypes.string.isRequired,
  external: PropTypes.bool,
  href: PropTypes.string.isRequired,
}


export default AuthDependantLink
