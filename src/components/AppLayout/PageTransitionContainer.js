import { useTransition } from '@react-spring/web'





import { connect } from '../../store'
import { notifyPageChange } from '../../store/actions'





const PageTransitionContainer = ({ children, items, keys, ...transitionProps }) => {
  return useTransition(items, keys, {
    initial: true,
    from: { opacity: 1 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: {
      tension: 350,
      friction: 25,
      clamp: true,
    },
    ...transitionProps,
  }).map(children)
}

PageTransitionContainer.mapDispatchToProps = {
  onDestroyed: notifyPageChange, // called by react-spring when a page is unmounted so we know that it's safe to destructively change global state.
}





export default connect(PageTransitionContainer)
