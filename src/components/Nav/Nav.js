import PropTypes from 'prop-types'
import {
  createContext,
  useContext,
  useMemo,
  useReducer,
} from 'react'





// Component constants
const NavContext = createContext(['', () => {}])

function reduceSubNavChange (state, nextId) {
  return state === nextId ? '' : nextId
}





function NavUl (props) {
  const {
    className,
    children,
    onClick,
  } = props

  const [openSubNav, setOpenSubNav] = useReducer(reduceSubNavChange, '')

  const ctxValue = useMemo(() => {
    return {
      globalClick: onClick,
      subNav: [openSubNav, setOpenSubNav],
    }
  }, [onClick, openSubNav])

  return (
    <ul className={className}>
      <NavContext.Provider value={ctxValue}>
        {children}
      </NavContext.Provider>
    </ul>
  )
}

NavUl.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
}





function Nav (props) {
  const {
    className,
    children,
    ...restProps
  } = props

  return (
    <nav className={className}>
      <NavUl {...restProps}>
        {children}
      </NavUl>
    </nav>
  )
}

Nav.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
}





function useNavContext () {
  return useContext(NavContext)
}





export default Nav
export {
  useNavContext,
  NavUl,
}
