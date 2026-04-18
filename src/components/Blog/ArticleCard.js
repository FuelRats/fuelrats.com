import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useSelector } from 'react-redux'

import { selectAuthorByBlogId, selectBlogById, selectCategoriesByBlogId } from '~/store/selectors'
import formatAsEliteDateTime from '~/util/date/formatAsEliteDateTime'
import makeBlogRoute from '~/util/router/makeBlogRoute'

import TextPlaceholder from '../TextPlaceholder'





function ArticleCard (props) {
  const { className, renderMode = 'excerpt' } = props

  const author = useSelector((state) => {
    return selectAuthorByBlogId(state, props)
  })
  const blog = useSelector((state) => {
    return selectBlogById(state, props)
  })
  const categories = useSelector((state) => {
    return selectCategoriesByBlogId(state, props)
  })

  if (!blog) {
    if (renderMode === 'article') {
      return (<article className="error page-content" />)
    }

    return null
  }

  const {
    id: authorId,
    name: authorName = (<TextPlaceholder loading size={30} />),
  } = author

  let content = null

  switch (renderMode) {
    case 'excerpt':
      content = blog.excerpt.rendered
      break

    case 'article':
      content = blog.content.rendered.replace(/<ul>/giu, '<ul class="bulleted">').replace(/<ol>/giu, '<ol class="numbered">')
      break

    default:
      break
  }

  /* eslint-disable react/no-danger */
  return (
    <article className={className}>
      <header>
        <h3 className="title">
          <Link dangerouslySetInnerHTML={{ __html: blog.title.rendered }} href={`/blog/${blog.id}`} />
        </h3>
      </header>

      <small>
        <span className="posted-date">
          <FontAwesomeIcon fixedWidth icon="clock" />
          {'Posted '}
          <time dateTime={blog.date_gmt}>{formatAsEliteDateTime(`${blog.date_gmt}Z`)}</time>
        </span>

        <span className="author">
          <FontAwesomeIcon fixedWidth icon="user" />
          <Link href={makeBlogRoute({ author: authorId })}>{authorName}</Link>
        </span>

        <span>
          <FontAwesomeIcon fixedWidth icon="folder" />

          <ul className="category-list">
            {
              categories.map((category) => {
                const {
                  id: categoryId,
                  description = 'loading...',
                  name = (<TextPlaceholder loading size={25} />),
                } = category

                return (
                  <li key={categoryId}>
                    <Link href={makeBlogRoute({ category: categoryId })} title={description}>{name}</Link>
                  </li>
                )
              })
            }
          </ul>
        </span>
      </small>

      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  )
}





export default ArticleCard
