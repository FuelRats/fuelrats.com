// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import React from 'react'
import withRedux from 'next-redux-wrapper'





// Component imports
import {
  actions,
  initStore,
} from '../store'
import Component from '../components/Component'
import Page from '../components/Page'





class Paperwork extends Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

//  componentDidMount () {
//    let { id } = this.props
//
//    if (id) {
//      this.props.retrieveBlog(id)
//    } else {
//      this.props.retrieveBlogs()
//    }
//  }

//  componentWillReceiveProps (nextProps) {
//    if (nextProps.blog) {
//      this.setState(nextProps.blog)
//    }
//  }

  constructor (props) {
    super(props)

    this.state = {}
  }

  static async getInitialProps ({ query }) {
    let { id } = query

    if (id) {
      return { id }
    }

    return {}
  }

  render () {
    let {
      retrieving,
    } = this.props

    let {} = this.state

    return (
      <Page title={this.title}>
        <header className="page-header">
          <h1>{this.title}</h1>
        </header>
      </Page>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get title () {
    return 'Blog'
  }
}





const mapDispatchToProps = dispatch => {
  return {
//    retrieveBlog: bindActionCreators(actions.retrievePaperwork, dispatch),
  }
}

const mapStateToProps = state => {
  return state.blogs
}





export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Paperwork)
