import hoistNonReactStatics from 'hoist-non-react-statics'
import getWrappedPage from './PageWrapper'





const asPage = (PageConfig) => {
  return (PageComponent) => {
    const WrappedPage = hoistNonReactStatics(getWrappedPage(PageConfig, PageComponent), PageComponent)
    WrappedPage.displayName = `Page(${PageComponent.displayName || PageComponent.name || 'PageComponent'})`
    return WrappedPage
  }
}





export default asPage
