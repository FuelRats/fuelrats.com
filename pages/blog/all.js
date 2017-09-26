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





class Blogs extends Component {

  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _renderMenu () {
    let {
      category,
      page,
      totalPages,
    } = this.props

    let hrefQueryParams = []
    let href = '/blog/all'
    let as = '/blog'

    if (category) {
      hrefQueryParams.push(`category=${category}`)
      as += `/category/${category}`
    }

    return (
      <menu
        type="toolbar">
        <div className="secondary">
          {(page > 1) && (
            <Link
              as={`${as}/page/${page - 1}`}
              href={`${href}?${hrefQueryParams.concat(`page=${page - 1}`).join('&')}`}>
              <a className="button">Previous Page</a>
            </Link>
          )}
        </div>

        <div className="primary">
          {(page < totalPages) && (
            <Link
              as={`${as}/page/${page + 1}`}
              href={`${href}?${hrefQueryParams.concat(`page=${page + 1}`).join('&')}`}>
              <a className="button">Next Page</a>
            </Link>
          )}
        </div>
      </menu>
    )
  }

  async _retrieveBlogs (options = {}) {
    let {
      category,
      page,
      retrieveBlogs,
    } = this.props

    let wpOptions = {}

    category = options.category || category
    wpOptions.page = options.page || page

    if (category) {
      wpOptions.categories = category
    }

    this.setState({
      retrieving: true,
    })

    await retrieveBlogs(wpOptions)

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
    let {
      category,
      page,
    } = this.props

    if ((page !== nextProps.page) || (category !== nextProps.category)) {
      this._retrieveBlogs({
        category: nextProps.category,
        page: page,
      })
    }
  }

  constructor (props) {
    super(props)

    this._bindMethods([
      '_retrieveBlogs',
    ])

    this.state = {
      retrieving: false,
    }
  }

  static async getInitialProps ({ query }) {
    let props = {}

    props.page = parseInt(query.page || 1)

    if (query.category) {
      props.category = query.category
    }

    return props
  }

  render () {
    let {
      blogs,
      query,
      totalPages,
    } = this.props
    let {
      retrieving,
    } = this.state

    let page = parseInt(query.page || 1)

    return (
      <div className="page-wrapper">
        <header className="page-header">
          <h2>{title}</h2>
        </header>

        <div className="page-content">
          <ol className="article-list loading">
            {!retrieving && blogs && blogs.map(blog => {
              let {
                author,
              } = blog

              blog.postedAt = moment(blog.date_gmt)

              return (
                <li key={blog.id}>
                  <article>
                    <header>
                      <h3 className="title">
                        <Link as={`/blog/${blog.id}`} href={`/blog/single?id=${blog.id}`}>
                          <a dangerouslySetInnerHTML={{ __html: blog.title.rendered }} />
                        </Link>
                      </h3>
                    </header>

                    <small>
                      <span className="posted-date">
                        <i className="fa fa-clock-o fa-fw" />
                        Posted <time dateTime={0}>{blog.postedAt.format('DD MMMM, YYYY')}</time>
                      </span>

                      <span className="author">
                        <i className="fa fa-fw fa-user" />

                        <Link
                          as={`/blog/author/${author.id}`}
                          href={`/blog/all?author=${author.id}`}>
                          <a>{author.name}</a>
                        </Link>
                      </span>

                      <span>
                        <i className="fa fa-folder fa-fw" />
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
                                <Link
                                  as={`/blog/category/${id}`}
                                  href={`/blog/all?category=${id}`}>
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

          {this._renderMenu()}
        </div>
      </div>
    )
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





export default Page(Blogs, title, {
  mapStateToProps,
  mapDispatchToProps,
})
