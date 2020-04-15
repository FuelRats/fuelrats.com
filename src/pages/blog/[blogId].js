// Module imports
import React from 'react'




// Component imports
import ArticleCard from '../../components/Blog/ArticleCard'
import { actions } from '../../store'
import { selectBlogById } from '../../store/selectors'





class Blog extends React.Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps ({ query, store }) {
    const state = store.getState()
    if (!selectBlogById(state, query)) {
      await actions.getBlog(query.blogId)(store.dispatch)
    }
  }

  static getPageMeta () {
    return {
      title: 'Blog',
    }
  }

  render () {
    const { query } = this.props
    return (
      <ArticleCard
        blogId={query.blogId}
        className="page-content"
        renderMode="article" />
    )
  }
}





export default Blog
