// Module imports
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'




// Component imports
import { Link } from '../../routes'
import { connect } from '../../store'
import Component from '../../components/Component'
import PageWrapper from '../../components/PageWrapper'
import TextPlaceholder from '../../components/TextPlaceholder'



@connect
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

    let route = [
      '/blog',
    ]

    if (author) {
      route.push(`/author/${category}`)
    } else if (category) {
      route.push(`/category/${category}`)
    }

    route = route.join('')

    return (
      <menu
        type="toolbar">
        <div className="secondary">
          {(page > 1) && (
            <Link route={page - 1 > 1 ? `${route}/page/${page - 1}` : route}>
              <a className="button">Previous Page</a>
            </Link>
          )}
        </div>

        <div className="primary">
          {(page < totalPages) && (
            <Link route={`${route}/page/${page + 1}`}>
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
        page: nextProps.page,
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
    const { authors, blogs, categories } = this.props
    const {
      retrieving,
    } = this.state

    return (
      <PageWrapper title="Blog">
        <div className="page-content">
          <ol className="article-list loading">
            {!retrieving && Boolean(blogs.length) && blogs.map(blog => {
              const {
                id,
              } = blog
              const postedAt = moment(blog.date_gmt)
              const author = authors[blog.author] || {
                id: blog.author,
                name: (<TextPlaceholder size={30} loading />),
              }

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
                        <FontAwesomeIcon icon="clock" fixedWidth />
                        Posted <time dateTime={0}>{postedAt.format('DD MMMM, YYYY')}</time>
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
                          {blog.categories.map(catId => {
                            const category = categories[catId] || {
                              id: catId,
                              description: 'Loading...',
                              name: (<TextPlaceholder size={25} loading />),
                            }

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
      </PageWrapper>
    )
  }

  static mapStateToProps = state => state.blogs

  static mapDispatchToProps = ['retrieveBlogs']
}





export default Blogs
