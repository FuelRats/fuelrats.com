import { useCallback } from 'react'

import asModal, { ModalContent, useModalContext } from '~/components/asModal'
import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import { connectState } from '~/store'
import { setFlag } from '~/store/actions/flags'
import { selectFlagByName } from '~/store/selectors'

import styles from './LoginModal.module.scss'
import LoginModalErrorBox from './LoginModalErrorBox'
import LoginView from './LoginView'
import PasskeyPromptView from './PasskeyPromptView'
import ResetView from './ResetView'
import TotpView from './TotpView'
import VerifyView from './VerifyView'
import clsx from 'clsx'




function LoginModal () {
  const [{ error, view }] = useModalContext()
  return (
    <ModalContent className={clsx(styles.loginModal, 'no-pad')}>
      <LoginModalErrorBox className={styles.errorBox} error={error} />
      {view === 'login' && (<LoginView />)}
      {view === 'verify' && (<VerifyView />)}
      {view === 'reset' && (<ResetView />)}
      {view === 'totp' && (<TotpView />)}
      {view === 'passkey-prompt' && (<PasskeyPromptView />)}
    </ModalContent>
  )
}




export default connectState((_, dispatch) => {
  return {
    onClose: useCallback(() => {
      return dispatch(setFlag('showLoginDialog', false))
    }, [dispatch]),
    isOpen: useSelectorWithProps({ name: 'showLoginDialog' }, selectFlagByName),
  }
})(asModal(
  {
    className: 'login-dialog',
    title: 'Login',
    initialState: { view: 'login' },
  },
)(LoginModal))
