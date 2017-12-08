// Module imports
import Link from 'next/link'
import moment from 'moment'
import React from 'react'





// Component imports
import Component from '../../components/Component'
import Page from '../../components/Page'





// Component constants
const title = 'Blog'





class Blogs extends Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _renderMenu () {
    const {
      author,
      category,
      page,
      totalPages,
    } = this.props

    const hrefQueryParams = []
    const href = '/blog/all'
    let as = '/blog'

    if (author) {
      hrefQueryParams.push(`author=${author}`)
      as += `/author/${author}`
    }

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
      author,
      category,
    } = this.props
    const {
      page,
      retrieveBlogs,
    } = this.props

    const wpOptions = {}

    author = options.author || author
    category = options.category || category
    wpOptions.page = options.page || page

    if (author) {
      wpOptions.author = author
    }

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
    const {
      author,
      category,
      page,
    } = this.props

    const authorMatches = author === nextProps.author
    const categoryMatches = category === nextProps.category
    const pageMatches = page === nextProps.page

    if (!authorMatches || !categoryMatches || !pageMatches) {
      this._retrieveBlogs({
        author: nextProps.author,
        category: nextProps.category,
        page,
      })
    }
  }

  constructor (props) {
    super(props)

    this.state = {
      retrieving: false,
    }
  }

  static async getInitialProps ({ query }) {
    const props = {}

    props.page = parseInt(query.page || 1, 10)

    if (query.category) {
      props.category = query.category
    }

    if (query.author) {
      props.author = query.author
    }

    return props
  }

  render () {
    const { blogs } = this.props
    const {
      retrieving,
    } = this.state

    return (
      <div className="page-wrapper">
        <header className="page-header">
          <h1>{title}</h1>
        </header>

        <div className="page-content">
          <ol className="article-list loading">
            {!retrieving && blogs && blogs.map(blog => {
              const {
                author,
                id,
              } = blog
              const postedAt = moment(blog.date_gmt)

              /* eslint-disable react/no-danger */
              return (
                <li key={id}>
                  <article>
                    <header>
                      <h3 className="title">
                        <Link as={`/blog/${id}`} href={`/blog/single?id=${id}`}>
                          <a dangerouslySetInnerHTML={{ __html: blog.title.rendered }} />
                        </Link>
                      </h3>
                    </header>

                    <small>
                      <span className="posted-date">
                        <i className="fa fa-clock-o fa-fw" />
                        Posted <time dateTime={0}>{postedAt.format('DD MMMM, YYYY')}</time>
                      </span>

                      <span className="author">
                        <i className="fa fa-fw fa-user" />

                        <Link as={`/blog/author/${author.id}`} href={`/blog/all?author=${author.id}`}>
                          <a>{author.name}</a>
                        </Link>
                      </span>

                      <span>
                        <i className="fa fa-folder fa-fw" />

                        <ul className="category-list">
                          {blog.categories.map(category => {
                            const {
                              description,
                              name,
                            } = category

                            return (
                              <li key={category.id}>
                                <Link as={`/blog/category/${category.id}`} href={`/blog/all?category=${category.id}`}>
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
                      dangerouslySetInnerHTML={{ __html: blog.excerpt.rendered }} />
                  </article>
                </li>
              )
              /* eslint-enable */
            })}
          </ol>

          {this._renderMenu()}
        </div>
      </div>
    )
  }
}





const mapDispatchToProps = ['retrieveBlogs']

const mapStateToProps = state => state.blogs





export default Page(Blogs, title, {
  mapStateToProps,
  mapDispatchToProps,
})
