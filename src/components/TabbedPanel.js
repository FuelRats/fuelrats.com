import clsx from 'clsx'
import { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { selectCurrentUserHasScope } from '~/store/selectors'




function TabHandle (props) {
  const {
    activeTab,
    name,
    tab,
    ...itemProps
  } = props

  const hasPermission = useSelector((state) => {
    return selectCurrentUserHasScope(state, { scope: tab.permission })
  })

  return hasPermission
    ? (
      <li
        {...itemProps}
        className={clsx('tab', { active: name === activeTab })}
        name={name}>
        <span className="tab-inner">
          {tab.title}
        </span>
      </li>
    )
    : null
}

function TabPanel (props) {
  const {
    onPermissionError,
    tab,
  } = props

  const hasPermission = useSelector((state) => {
    return selectCurrentUserHasScope(state, { scope: tab.permission })
  })

  useEffect(() => {
    if (!hasPermission) {
      onPermissionError(tab.permission)
    }
  }, [tab.permission, onPermissionError, hasPermission])


  return hasPermission
    ? (
      <div className="tab-pane">
        {tab.render()}
      </div>
    )
    : null
}

function TabbedPanel ({ activeTab, tabs, onTabClick, onPermissionError }) {
  const handleTabClick = useCallback((event) => {
    onTabClick(event.target.getAttribute('name'))
  }, [onTabClick])

  return (
    <div className="tabbed-panel">
      <nav className="tabs">
        <ul>
          {
            Object.entries(tabs).map(([key, tab]) => {
              return (
                <TabHandle
                  key={key}
                  activeTab={activeTab}
                  name={key}
                  tab={tab}
                  onClick={handleTabClick}
                  onKeyPress={handleTabClick} />
              )
            })
          }
        </ul>
      </nav>

      {tabs[activeTab] && <TabPanel tab={tabs[activeTab]} onPermissionError={onPermissionError} />}
    </div>
  )
}



export default TabbedPanel
