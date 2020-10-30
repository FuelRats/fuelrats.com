import Link from 'next/link'
import React from 'react'

import ArticleCard from '~/components/Blog/ArticleCard'
import { makeBlogRoute } from '~/helpers/routeGen'
import safeParseInt from '~/helpers/safeParseInt'
import { connect } from '~/store'
import {
  selectBlogs,
  selectBlogStatistics,
} from '~/store/selectors'





// Component constants
const BASE_TEN_RADIX = 10
const DEFAULT_PAGE = 1





@connect
class Blogs extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    retrieving: false,
  }





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

    return (
      <menu
        type="toolbar">
        <div className="secondary">
          {
            (page > 1) && (
              <Link href={makeBlogRoute({ author, category, page: Math.max(1, page - 1) })}>
                <a className="button">{'Previous Page'}</a>
              </Link>
            )
          }
        </div>

        <div className="primary">
          {
            (page < totalPages) && (
              <Link href={makeBlogRoute({ author, category, page: Math.min(page + 1, totalPages) })}>
                <a className="button">{'Next Page'}</a>
              </Link>
            )
          }
        </div>
      </menu>
    )
  }

  async _getBlogs (options = {}) {
    let {
      author,
      category,
    } = this.props

    const {
      page,
      getBlogs,
    } = this.props

    const wpOptions = {}

    author = typeof options.author === 'undefined' ? author : options.author
    category = typeof options.category === 'undefined' ? category : options.category

    if (author) {
      wpOptions.author = author
    }

    if (category) {
      wpOptions.categories = category
    }

    wpOptions.page = options.page || page

    this.setState({
      retrieving: true,
    })

    await getBlogs(wpOptions)

    this.setState({
      retrieving: false,
    })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidUpdate (prevProps) {
    if (
      prevProps.page !== this.props.page
      || prevProps.category !== this.props.category
      || prevProps.author !== this.props.author) {
      this._getBlogs()
    }
  }

  componentDidMount () {
    this._getBlogs()
  }

  static getInitialProps ({ query }) {
    const props = {}

    props.page = safeParseInt(query.page || DEFAULT_PAGE, BASE_TEN_RADIX, DEFAULT_PAGE)

    if (query.category) {
      props.category = query.category
    }

    if (query.author) {
      props.author = query.author
    }

    return props
  }

  static getPageMeta () {
    return {
      title: 'Blog',
      pageKey: 'blog-list',
    }
  }

  render () {
    const { blogs } = this.props
    const {
      retrieving,
    } = this.state

    return (
      <div className="page-content">
        <ol className="article-list loading">
          {
            !retrieving && Boolean(blogs.length) && blogs.map((blog) => {
              return (
                <li key={blog.id}>
                  <ArticleCard blogId={blog.id} renderMode="excerpt" />
                </li>
              )
            })
          }
        </ol>

        {this._renderMenu()}
      </div>
    )
  }

  static mapStateToProps = (state) => {
    return {
      blogs: selectBlogs(state),
      ...selectBlogStatistics(state),
    }
  }

  static mapDispatchToProps = ['getBlogs']
}





export default Blogs
