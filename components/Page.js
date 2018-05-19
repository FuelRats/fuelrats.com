// Component imports
import { reduxConnect } from '../helpers'
import Component from './Component'





const pageWrapper = (title = 'Page', authReq = false) => Page => (
  class PageWrapper extends Component {
    static displayName = `Page(${Page.displayName || Page.name || title.replace(/\s/g, '')})`
    static title = title
    static authenticationRequired = Boolean(authReq)
    static getInitialProps = ctx => (Page.getInitialProps ? Page.getInitialProps(ctx) : {})

    render () {
      return (<Page {...this.props} />)
    }
  }
)

const connectPage = (title, authReq, ...connectArgs) => Page => pageWrapper(title, authReq)(reduxConnect(...connectArgs)(Page))

export default function (title, authReq, ...rest) {
  if (rest.length) {
    return connectPage(title, authReq, ...rest)
  }
  return pageWrapper(title, authReq)
}
export {
  connectPage,
  pageWrapper,
}
