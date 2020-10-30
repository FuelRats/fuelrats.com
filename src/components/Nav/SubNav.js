import PropTypes from 'prop-types'
import { useCallback } from 'react'

import { useNavContext } from './Nav'

function SubNav (props) {
  const {
    children,
    name = 'FRNavSubNav',
    title,
  } = props

  const { subNav: [openSubNav, setOpenSubNav] } = useNavContext()

  const handleInputClick = useCallback((event) => {
    setOpenSubNav(event?.target?.id)
  }, [setOpenSubNav])

  const id = `${name}-${props.id}`
  return (
    <li>
      <input
        aria-hidden
        hidden
        checked={openSubNav === id}
        className="subnav-toggle"
        id={id}
        name={name}
        type="checkbox"
        value={props.id}
        onChange={handleInputClick} />
      <label htmlFor={id}>
        <span>
          {title}
        </span>
      </label>
      <ul className="subnav">
        {children}
      </ul>
    </li>
  )
}

SubNav.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  title: PropTypes.string.isRequired,
}





export default SubNav
