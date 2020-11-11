import dynamic from 'next/dynamic'

import NewPasswordPlaceholder from './NewPasswordPlaceholder'





export default function dynamicNewPasswordFieldset (props = {}) {
  return dynamic(() => {
    return import('./NewPasswordFieldset')
  }, {
    loading: () => {
      return (
        <NewPasswordPlaceholder {...props} />
      )
    },
  })
}
