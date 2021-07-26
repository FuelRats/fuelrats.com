import asModal, { ModalContent, useModalContext } from '~/components/asModal'
import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import { connectState, useAction } from '~/store'
import { setFlag } from '~/store/actions/flags'
import { selectFlagByName } from '~/store/selectors'

import styles from './LoginModal.module.scss'
import LoginModalErrorBox from './LoginModalErrorBox'
import LoginView from './LoginView'
import ResetView from './ResetView'
import VerifyView from './VerifyView'




function LoginModal () {
  const [{ error, view }] = useModalContext()
  return (
    <ModalContent className={[styles.loginModal, 'no-pad']}>
      <LoginModalErrorBox className={styles.errorBox} error={error} />
      {view === 'login' && (<LoginView />)}
      {view === 'verify' && (<VerifyView />)}
      {view === 'reset' && (<ResetView />)}
    </ModalContent>
  )
}





const hideLoginDialog = setFlag.bind(null, 'showLoginDialog', false)
export default connectState(() => {
  return {
    onClose: useAction(hideLoginDialog),
    isOpen: useSelectorWithProps({ name: 'showLoginDialog' }, selectFlagByName),
  }
})(asModal(
  {
    className: 'login-dialog',
    title: 'Login',
    initialState: { view: 'login' },
  },
)(LoginModal))
