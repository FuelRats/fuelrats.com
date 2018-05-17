import Component from './Component'
import authentication from '../store/reducers/authentication';



class Page extends Component {
  static title = 'FuelRats'
  static authenticationRequired = false
}


// Designed to wrap pure functions.
const inheritPage = (title = 'FuelRats', authenticationRequired = false) => (renderFunc) => {

  class PageWrapper extends Page {
    static title = title
    static authenticationRequired = authenticationRequired
    render = () => renderFunc(this.props)
  }

  return PageWrapper
}

export default Page
export {
  inheritPage
}
