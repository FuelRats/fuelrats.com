import React from 'react'

import ArticleCard from '~/components/Blog/ArticleCard'
import { getBlog } from '~/store/actions/blogs'
import { selectBlogById } from '~/store/selectors'





class Blog extends React.Component {
  static async getInitialProps ({ query, store }) {
    const state = store.getState()
    if (!selectBlogById(state, query)) {
      await store.dispatch(getBlog(query.blogId))
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
