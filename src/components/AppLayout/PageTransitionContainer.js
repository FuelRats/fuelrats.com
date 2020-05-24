import { useTransition } from '@react-spring/web'





import { connect } from '~/store'
import { notifyPageDestroyed } from '~/store/actions'





const PageTransitionContainer = ({ children, items, ...transitionProps }) => {
  const transition = useTransition(items, {
    initial: true,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: {
      tension: 250,
      friction: 25,
      clamp: true,
    },
    ...transitionProps,
  })

  return transition(children)
}

PageTransitionContainer.mapDispatchToProps = {
  onRest: notifyPageDestroyed, // called by react-spring when a page is unmounted so we know that it's safe to destructively change global state.
}





export default connect(PageTransitionContainer)
