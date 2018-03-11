// Module imports
import moment from 'moment'
import React from 'react'





// Component imports
import { Link } from '../../routes'
import Component from '../../components/Component'
import Page from '../../components/Page'





// Component constants
const title = 'Blog'





class Blog extends Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  async _retrieveBlog () {
    const {
      query,
      retrieveBlog,
    } = this.props

    this.setState({ retrieving: true })

    await retrieveBlog(query.id)

    this.setState({
      blog: this.props.blogs.find(blog => (blog.id === query.id) || (blog.slug === query.id)),
      retrieving: false,
    })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    this._retrieveBlog()
  }

  constructor (props) {
    super(props)

    const blog = props.blogs.find(item => item.id === props.id)

    this.state = {
      blog,
      retrieving: !!blog,
    }
  }

  render () {
    const {
      blog,
      retrieving,
    } = this.state

    let content

    if (blog) {
      content = blog.content.rendered.replace(/<ul>/gi, '<ul class="bulleted">').replace(/<ol>/gi, '<ol class="numbered">')
    }

    /* eslint-disable react/no-danger */
    return (
      <div className="page-wrapper">
        <header className="page-header">
          <h1>{title}</h1>
        </header>

        {retrieving && (
          <article className="loading page-content" />
        )}

        {(!retrieving && blog) && (
          <article className="page-content">
            <header>
              <h2
                className="title"
                dangerouslySetInnerHTML={{ __html: blog.title.rendered }} />
            </header>

            <small>
              <span className="posted-date">
                <i className="fa fa-clock-o fa-fw" />
                Posted <time dateTime={0}>{moment(blog.date_gmt).format('DD MMMM, YYYY')}</time>
              </span>

              <span className="author">
                <i className="fa fa-fw fa-user" />

                <Link as={`/blog/author/${blog.author.id}`} href={`/blog/all?author=${blog.author.id}`}>
                  <a>{blog.author.name}</a>
                </Link>
              </span>

              <span>
                <i className="fa fa-folder fa-fw" />

                <ul className="category-list">
                  {blog.categories.map(category => (
                    <li key={category.id}>
                      <Link as={`/blog/category/${category.id}`} href={`/blog/all?category=${category.id}`}>
                        <a title={category.description}>{category.name}</a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </span>
            </small>

            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: content }} />

            <aside className="comments">
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
            </aside>
          </article>
        )}

        {(!retrieving && !blog) && (
          <article className="error page-content" />
        )}
      </div>
    )
    /* eslint-enable */
  }
}





const mapDispatchToProps = ['retrieveBlog']

const mapStateToProps = state => state.blogs





export default Page(Blog, title, {
  mapStateToProps,
  mapDispatchToProps,
})
