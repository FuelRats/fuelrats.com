import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ArticleCard from '~/components/Blog/ArticleCard'
import BlogMenu from '~/components/Blog/BlogMenu'
import { getBlogs } from '~/store/actions/blogs'
import {
  selectBlogs,
  selectBlogStatistics,
} from '~/store/selectors'
import safeParseInt from '~/util/safeParseInt'





// Component constants
const BASE_TEN_RADIX = 10
const DEFAULT_PAGE = 1

function Blogs (props) {
  const { author, category } = props.query
  const page = safeParseInt(props.query.page ?? DEFAULT_PAGE, BASE_TEN_RADIX, DEFAULT_PAGE)

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

      <BlogMenu author={author} category={category} page={page} totalPages={totalPages} />
    </div>
  )
}

Blogs.getPageMeta = () => {
  return {
    title: 'Blog',
    key: 'blog-list',
  }
}





export default Blogs
