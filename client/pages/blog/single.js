// Module imports
import moment from 'moment'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'




// Component imports
import { actions, connect } from '../../store'
import { Link } from '../../routes'
import Component from '../../components/Component'
import PageWrapper from '../../components/PageWrapper'
import TextPlaceholder from '../../components/TextPlaceholder'


@connect
class Blog extends Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/


  static async getInitialProps ({ query, store }) {
    await actions.retrieveBlog(query.id)(store.dispatch)
  }

  render () {
    const {
      blog,
      authors,
      categories,
    } = this.props

    let content = null
    let author = null

    if (blog) {
      content = blog.content.rendered.replace(/<ul>/giu, '<ul class="bulleted">').replace(/<ol>/giu, '<ol class="numbered">')
      author = authors[blog.author] || {
        id: blog.author,
        name: (<TextPlaceholder size={30} loading />),
      }
    }

    /* eslint-disable react/no-danger */
    return (
      <PageWrapper title="Blog">
        {blog && (
          <article className="page-content">
            <header>
              <h2
                className="title"
                dangerouslySetInnerHTML={{ __html: blog.title.rendered }} />
            </header>

            <small>
              <span className="posted-date">
                <FontAwesomeIcon icon="clock" fixedWidth />
                Posted <time dateTime={0}>{moment(blog.date_gmt).format('DD MMMM, YYYY')}</time>
              </span>

              <span className="author">
                <FontAwesomeIcon icon="user" fixedWidth />

                <Link as={`/blog/author/${author.id}`} href={`/blog/all?author=${author.id}`}>
                  <a>{author.name}</a>
                </Link>
              </span>

              <span>
                <FontAwesomeIcon icon="folder" fixedWidth />

                <ul className="category-list">
                  {blog.categories.map((catId) => {
                    const category = categories[catId] || {
                      id: catId,
                      description: 'Loading...',
                      name: (<TextPlaceholder size={25} loading />),
                    }

                    return (
                      <li key={category.id}>
                        <Link as={`/blog/category/${category.id}`} href={`/blog/all?category=${category.id}`}>
                          <a title={category.description}>{category.name}</a>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </span>
            </small>

            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: content }} />

            {/* <aside className="comments">
              <header>
                <h3>Comments</h3>
              </header>

              <ol>
                {(blog.comments && blog.comments.length) ? blog.comments.map(comment => (
                  <li key={comment.id}>
                    <article className="comment">
                      <header>
                        <img alt="Author's avatar" src={comment.author_avatar_urls['48']} />

                        <small><span className="author-name">{comment.author_name}</span> &middot; {moment(comment.date_gmt).fromNow()}</small>
                      </header>

                      <div
                        className="content"
                        dangerouslySetInnerHTML={{ __html: comment.content.rendered }} />
                    </article>
                  </li>
                )) : 'No comments... yet.'}
              </ol>
            </aside> */}
          </article>
        )}

        {!blog && (
          <article className="error page-content" />
        )}
      </PageWrapper>
    )
    /* eslint-enable */
  }

  static mapStateToProps = ({ blogs: { blogs, ...restBlogs } }, { query }) => ({
    blog: blogs.find((blog) => (blog.id.toString() === query.id) || (blog.slug === query.id)),
    ...restBlogs,
  })

  static mapDispatchToProps = ['retrieveBlog']
}





export default Blog
