import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'


import { formatAsEliteDateTime } from '../../helpers/formatTime'
import { Link } from '../../routes'
import { connect } from '../../store'
import { selectAuthorByBlogId, selectBlogById, selectCategoriesByBlogId } from '../../store/selectors'
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

  const { id } = blog
  const {
    id: authorId,
    name: authorName = (<TextPlaceholder size={30} loading />),
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
          <Link route="blog view" params={{ blogId: id }}>
            <a dangerouslySetInnerHTML={{ __html: blog.title.rendered }} />
          </Link>
        </h3>
      </header>

      <small>
        <span className="posted-date">
          <FontAwesomeIcon icon="clock" fixedWidth />
          {'Posted '}
          <time dateTime={blog.date_gmt}>{formatAsEliteDateTime(`${blog.date_gmt}Z`)}</time>
        </span>

        <span className="author">
          <FontAwesomeIcon icon="user" fixedWidth />
          <Link route="blog list" params={{ author: authorId }}>
            <a>{authorName}</a>
          </Link>
        </span>

        <span>
          <FontAwesomeIcon icon="folder" fixedWidth />

          <ul className="category-list">
            {
              categories.map((category) => {
                const {
                  id: categoryId,
                  description = 'loading...',
                  name = (<TextPlaceholder size={25} loading />),
                } = category

                return (
                  <li key={categoryId}>
                    <Link route="blog list" params={{ category: categoryId }}>
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





ArticleCard.mapStateToProps = (state, ownProps) => ({
  author: selectAuthorByBlogId(state, ownProps),
  blog: selectBlogById(state, ownProps),
  categories: selectCategoriesByBlogId(state, ownProps),
})





export default connect(ArticleCard)
