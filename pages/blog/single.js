// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import Link from 'next/link'
import moment from 'moment'
import Router from 'next/router'
import React from 'react'





// Component imports
import { actions } from '../../store'
import Component from '../../components/Component'
import Page from '../../components/Page'





// Component constants
const title = 'Blog'





class Blog extends Component {

  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  async _retrieveBlog () {
    this.setState({
      retrieving: true,
    })

    await this.props.retrieveBlog(this.props.id)

    this.setState({
      blog: this.props.blogs.find(blog => blog.id === this.props.id),
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

    this.state = {
      blog: props.blogs.find(blog => blog.id === props.id),
      retrieving: true,
    }
  }

  static async getInitialProps ({ query }) {
    let { id } = query

    if (!id || id < 1) {
      id = 1
    }

    id = parseInt(id)

    return {
      id,
      query,
    }
  }

  render () {
    let {
      blog,
      retrieving,
    } = this.state

    let content

    if (blog) {
      content = blog.content.rendered
        .replace(/<ul>/gi, '<ul class="bulleted">')
        .replace(/<ol>/gi, '<ol class="numbered">')
    }

    return (
      <div className="page-wrapper">
        <header className="page-header">
          <h1>{title}</h1>
        </header>

        {retrieving && (
          <article className="loading page-content" />
        )}

        {!retrieving && (
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

                <Link href={`/blogs/author/${blog.author.id}`}>
                  <a>{blog.author.name}</a>
                </Link>
              </span>

              <span>
                <i className="fa fa-folder fa-fw" />

                <ul className="category-list">
                  {blog.categories.map(category => {
                    let {
                      description,
                      id,
                      name,
                    } = category

                    return (
                      <li key={id}>
                        <Link href={`/blogs/category/${id}`}>
                          <a title={description}>{name}</a>
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

            <aside className="comments">
              <header>
                <h3>Comments</h3>
              </header>

              <ol>
                {(blog.comments && blog.comments.length) ? blog.comments.map(comment => {
                  return (
                    <li key={comment.id}>
                      <article className="comment">
                        <header>
                          <img src={comment.author_avatar_urls['48']} />

                          <small>
                             <span className="author-name">{comment.author_name}</span> &middot; {moment(comment.date_gmt).fromNow()}
                          </small>
                        </header>

                        <div
                          className="content"
                          dangerouslySetInnerHTML={{ __html: comment.content.rendered }} />
                      </article>
                    </li>
                  )
                }) : 'No comments... yet.'}
              </ol>
            </aside>
          </article>
        )}
      </div>
    )
  }
}





const mapDispatchToProps = dispatch => {
  return {
    retrieveBlog: bindActionCreators(actions.retrieveBlog, dispatch),
  }
}

const mapStateToProps = state => {
  return state.blogs
}





export default Page(Blog, title, {
  mapStateToProps,
  mapDispatchToProps,
})
