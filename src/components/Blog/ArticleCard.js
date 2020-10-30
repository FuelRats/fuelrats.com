import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

import { formatAsEliteDateTime } from '~/helpers/formatTime'
import { makeBlogRoute } from '~/helpers/routeGen'
import { connect } from '~/store'
import { selectAuthorByBlogId, selectBlogById, selectCategoriesByBlogId } from '~/store/selectors'

import TextPlaceholder from '../TextPlaceholder'





function ArticleCard (props) {
  const {
    author,
    blog,
    categories,
    className,
    renderMode = 'excerpt',
  } = props

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
          <Link href={`/blog/${blog.id}`}>
            <a dangerouslySetInnerHTML={{ __html: blog.title.rendered }} />
          </Link>
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
          <Link href={makeBlogRoute({ author: authorId })}>
            <a>{authorName}</a>
          </Link>
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
                    <Link href={makeBlogRoute({ category: categoryId })}>
                      <a title={description}>{name}</a>
                    </Link>
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





ArticleCard.mapStateToProps = (state, ownProps) => {
  return {
    author: selectAuthorByBlogId(state, ownProps),
    blog: selectBlogById(state, ownProps),
    categories: selectCategoriesByBlogId(state, ownProps),
  }
}





export default connect(ArticleCard)
