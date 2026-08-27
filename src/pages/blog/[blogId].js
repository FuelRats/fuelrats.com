import ArticleCard from '~/components/Blog/ArticleCard'
import { getBlog } from '~/store/actions/blogs'
import { selectBlogById } from '~/store/selectors'




const NAMED_ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  '#039': '\'',
  apos: '\'',
  nbsp: ' ',
  hellip: '…',
}

// WordPress returns titles as rendered HTML. Reduce to plain text for use in
// the document title/meta tags by stripping tags and decoding common entities.
function decodeBlogTitle (rendered) {
  return rendered
    .replace(/<[^>]*>/gu, '')
    .replace(/&(#x?[0-9a-f]+|[a-z0-9]+);/giu, (match, entity) => {
      if (entity[0] === '#') {
        const isHex = entity[1] === 'x' || entity[1] === 'X'
        const codePoint = isHex
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10)
        return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint)
      }
      return NAMED_ENTITIES[entity.toLowerCase()] ?? match
    })
    .trim()
}


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

Blog.getPageMeta = ({ query, store }) => {
  const blog = selectBlogById(store.getState(), query)
  const title = blog?.title?.rendered
    ? decodeBlogTitle(blog.title.rendered)
    : 'Blog'

  return {
    title,
  }
}




export default Blog
