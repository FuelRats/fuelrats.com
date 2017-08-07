// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import Link from 'next/link'
import moment from 'moment'
import Router from 'next/router'
import React from 'react'
import withRedux from 'next-redux-wrapper'





// Component imports
import {
  actions,
  initStore,
} from '../store'
import Component from '../components/Component'
import Page from '../components/Page'





class Blogs extends Component {

  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _newerPage () {
    let newPage = this.state.page - 1
    Router.push(`/blogs?page=${newPage}`, `/blogs/page/${newPage}`)
  }

  _olderPage () {
    let newPage = this.state.page + 1
    Router.push(`/blogs?page=${newPage}`, `/blogs/page/${newPage}`)
  }

  async _retrieveBlogs () {
    this.setState({
      retrieving: true,
    })

    await this.props.retrieveBlogs(this.state.page)

    this.setState({
      retrieving: false,
    })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    this._retrieveBlogs()
  }

  componentWillReceiveProps (nextProps) {
    let nextPage = parseInt(nextProps.url.query.page || 1)

    if (nextPage !== this.state.page) {
      this.setState({
        page: nextPage
      }, this._retrieveBlogs)
    }
  }

  constructor (props) {
    super(props)

    this._bindMethods([
      '_newerPage',
      '_olderPage',
      '_retrieveBlogs',
    ])

    this.state = {
      retrieving: false,
      page: props.page || 1,
    }
  }

  static async getInitialProps ({ query }) {
    let { page } = query

    if (!page || page < 1) {
      page = 1
    }

    page = parseInt(page)

    return {
      page
    }
  }

  render () {
    let {
      blogs,
      totalPages,
    } = this.props
    let {
      page,
      retrieving,
    } = this.state

    return (
      <Page title={this.title}>
        <header className="page-header">
          <h1>{this.title}</h1>
        </header>

        <div className="page-content">
          <ol className="article-list loading">
            {!retrieving && blogs && blogs.map(blog => {
              blog.postedAt = moment(blog.date_gmt)

              return (
                <li key={blog.id}>
                  <article>
                    <header>
                      <h2 className="title">
                        <Link href={`/blog/${blog.id}`}>
                          <a dangerouslySetInnerHTML={{ __html: blog.title.rendered }} />
                        </Link>
                      </h2>
                    </header>

                    <small>
                      <span className="posted-date">
                        <i className="fa fa-clock-o" />
                        Posted <time dateTime={0}>{blog.postedAt.format('DD MMMM, YYYY')}</time>
                      </span>

                      <span className="author">
                        <i className="fa fa-user" />
                        {blog.author}
                      </span>

                      <span>
                        <i className="fa fa-folder" />
                        Categories:
                        <ul className="category-list">
                          {blog.categories.map(category => {
                            let {
                              description,
                              id,
                              name,
                            } = category

                            return (
                              <li key={id}>
                                <Link href={`/blog/category/${id}`}>
                                  <a title={description}>{name}</a>
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      </span>
                    </small>

                    <div dangerouslySetInnerHTML={{ __html: blog.excerpt.rendered }} />
                  </article>
                </li>
              )
            })}
          </ol>

          <menu
            type="toolbar">
            <div className="secondary">
              {(page > 1) && (
                <button
                  onClick={this._newerPage}>
                  Newer
                </button>
              )}
            </div>

            <div className="primary">
              {(page < totalPages) && (
                <button
                  onClick={this._olderPage}>
                  Older
                </button>
              )}
            </div>
          </menu>
        </div>
      </Page>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get title () {
    return 'Blog'
  }
}





const mapDispatchToProps = dispatch => {
  return {
    retrieveBlogs: bindActionCreators(actions.retrieveBlogs, dispatch),
  }
}

const mapStateToProps = state => {
  return state.blogs
}





export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Blogs)
