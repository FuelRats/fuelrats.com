import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ArticleCard from '~/components/Blog/ArticleCard'
import Pagination from '~/components/Pagination/Pagination'
import { getBlogs } from '~/store/actions/blogs'
import {
  selectBlogs,
  selectBlogStatistics,
} from '~/store/selectors'
import makeBlogRoute from '~/util/router/makeBlogRoute'
import safeParseInt from '~/util/safeParseInt'





// Component constants
const DEFAULT_PAGE = 1

function Blogs (props) {
  const { author, category } = props.query
  const page = safeParseInt(props.query.page) ?? DEFAULT_PAGE

  const dispatch = useDispatch()
  const [retrieving, setRetrieving] = useState(false)
  const { totalPages } = useSelector(selectBlogStatistics)
  const blogs = useSelector(selectBlogs)

  useEffect(() => {
    const updateList = async () => {
      setRetrieving(true)
      await dispatch(getBlogs({
        author,
        categories: category,
        page,
      }))
      setRetrieving(false)
    }

    updateList()
  }, [author, category, dispatch, page])

  const handleGenerateRoute = useCallback((nextParams) => {
    return makeBlogRoute({
      ...nextParams,
      author,
      category,
    })
  }, [author, category])

  return (
    <div className="page-content">
      <ol className="article-list loading">
        {
          Boolean(!retrieving && blogs.length) && blogs.map((blog) => {
            return (
              <li key={blog.id}>
                <ArticleCard blogId={blog.id} renderMode="excerpt" />
              </li>
            )
          })
        }
      </ol>

      <Pagination
        page={page}
        totalPages={totalPages}
        onGenerateRoute={handleGenerateRoute} />
    </div>
  )
}

Blogs.getPageMeta = () => {
  return {
    title: 'Blog',
    key: 'blog-list',
    description: 'Dive into the Fuel Rats Blog to explore thrilling tales of in-game rescues, updates, and insights from our adventurous team!',
  }
}





export default Blogs
