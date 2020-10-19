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





export default function Nav ({ children }) {
  const [openSubNav, setOpenSubNav] = useReducer(reduceSubNavChange, '')

  const ctxValue = useMemo(() => {
    return [openSubNav, setOpenSubNav]
  }, [openSubNav, setOpenSubNav])

  return (
    <nav>
      <ul>
        <NavContext.Provider value={ctxValue}>
          {children}
        </NavContext.Provider>
      </ul>
    </nav>
  )
}

export function useNavContext () {
  return useContext(NavContext)
}
