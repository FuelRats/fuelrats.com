import React from 'react'
import { Transition } from 'react-spring'




const TransitionContext = React.createContext(null)





const PageLayout = ({ items, keys }) => (
  <Transition
    native
    initial
    from={{ opacity: 0 }}
    enter={{ opacity: 1 }}
    leave={{ opacity: 0 }}
    config={{
      tension: 350,
      friction: 25,
      clamp: true,
    }}
    items={items}
    keys={keys}>
    {({ Page, pageProps, shouldRender }) => (style) => (
      <TransitionContext.Provider value={style}>
        {shouldRender && (
          <Page {...pageProps} />
        )}
      </TransitionContext.Provider>
    )}
  </Transition>
)



const {
  Consumer: TransitionContextConsumer,
} = TransitionContext

export default PageLayout
export {
  TransitionContextConsumer,
}
