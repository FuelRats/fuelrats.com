import { useTransition } from '@react-spring/web'
import React from 'react'




const TransitionContext = React.createContext(null)


const PageTransitionContainer = ({ items, keys, ...transitionProps }) => {
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
  }).map(({ item, key, props }) => {
    const {
      Page,
      pageProps,
      shouldRender,
    } = item

    return shouldRender && (
      <TransitionContext.Provider key={key} value={props}>
        <Page {...pageProps} />
      </TransitionContext.Provider>
    )
  })
}




const {
  Consumer: TransitionConsumer,
} = TransitionContext

export default PageTransitionContainer
export {
  TransitionConsumer,
}
