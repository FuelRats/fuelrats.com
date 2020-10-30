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





function useNavContext () {
  return useContext(NavContext)
}





function Nav ({ className, children }) {
  const [openSubNav, setOpenSubNav] = useReducer(reduceSubNavChange, '')

  const ctxValue = useMemo(() => {
    return [openSubNav, setOpenSubNav]
  }, [openSubNav, setOpenSubNav])

  return (
    <nav className={className}>
      <ul>
        <NavContext.Provider value={ctxValue}>
          {children}
        </NavContext.Provider>
      </ul>
    </nav>
  )
}

Nav.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}



export default Nav
export {
  useNavContext,
}
