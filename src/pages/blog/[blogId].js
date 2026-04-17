import ArticleCard from '~/components/Blog/ArticleCard'
import { getBlog } from '~/store/actions/blogs'
import { selectBlogById } from '~/store/selectors'




function Blog ({ query }) {
  return (
    <ArticleCard
      blogId={query.blogId}
      className="page-content"
      renderMode="article" />
  )
}

Blog.getInitialProps = async ({ query, store }) => {
  const state = store.getState()
  if (!selectBlogById(state, query)) {
    await store.dispatch(getBlog(query.blogId))
  }
}

Blog.getPageMeta = () => {
  return {
    title: 'Blog',
  }
}




export default Blog
