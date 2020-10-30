import PropTypes from 'prop-types'

import { useRenderedChildCount } from '~/hooks/useChildCount'

function NavSection (props) {
  const {
    children,
    className,
    title,
  } = props

  const childCount = useRenderedChildCount(children)
  if (childCount === 0) {
    return null
  }

  return (
    <li className={className}>
      {
        title && (
          <header>
            {title}
          </header>
        )
      }
      <ul>
        {children}
      </ul>
    </li>
  )
}

NavSection.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.node,
}


export default NavSection
