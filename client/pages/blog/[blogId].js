// Module imports
import React from 'react'




// Component imports
import { PageWrapper } from '../../components/AppLayout'
import ArticleCard from '../../components/Blog/ArticleCard'
import { actions } from '../../store'
import { selectBlogById } from '../../store/selectors'





class Blog extends React.Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/


  static async getInitialProps ({ query, store }) {
    await actions.getBlog(query.blogId)(store.dispatch)
  }

  render () {
    const { query } = this.props
    return (
      <PageWrapper title="Blog">
        <ArticleCard
          blogId={query.blogId}
          className="page-content"
          renderMode="article" />
      </PageWrapper>
    )
  }
}





export default Blog
