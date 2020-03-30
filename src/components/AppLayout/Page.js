import getWrappedPage from './PageWrapper'





const asPage = (PageConfig) => {
  return (PageComponent) => {
    const WrappedPage = getWrappedPage(PageConfig, PageComponent)

    WrappedPage.displayName = `Page(${PageComponent.displayName || PageComponent.name || 'PageComponent'})`

    return WrappedPage
  }
}





export default asPage
