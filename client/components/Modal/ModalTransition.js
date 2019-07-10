import { useTransition } from 'react-spring'





const useModalTransition = (isOpen, key, transitionOpts) => useTransition(isOpen, key, {
  from: { pos: -100 },
  enter: { pos: 0 },
  leave: { pos: -100 },
  config: {
    tension: 350,
  },
  unique: true,
  ...transitionOpts,
})





export default useModalTransition
