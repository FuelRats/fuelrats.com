import { useTransition } from 'react-spring'





const ModalTransition = ({ children, isOpen, ...transitionOpts }) => useTransition(isOpen, null, {
  from: { opacity: 0 },
  enter: { opacity: 1 },
  leave: { opacity: 0 },
  ...transitionOpts,
}).map(children)





export default ModalTransition
