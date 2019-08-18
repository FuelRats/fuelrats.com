import React from 'react'
import { useTransition } from 'react-spring'

const TransitionContext = React.createContext(null)

const PageLayout = ({ items, keys, ...transitionProps }) => useTransition(items, keys, {
  initial: true,
  from: { opacity: 0 },
  enter: { opacity: 1 },
  leave: { opacity: 0 },
  config: {
    tension: 350,
    friction: 25,
    clamp: true,
  },
  ...transitionProps,
}).map(({ item, key, props }) => {
  const { Page, pageProps, shouldRender } = item

  return (
    shouldRender && (
      <TransitionContext.Provider key={key} value={props}>
        <Page {...pageProps} />
      </TransitionContext.Provider>
    )
  )
})

const { Consumer: TransitionContextConsumer } = TransitionContext

export default PageLayout
export { TransitionContextConsumer }
