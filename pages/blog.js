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





class Blog extends Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (props) {
    super(props)

    this.state = {
      blog: props.blogs.find(blog => blog.id === props.id)
    }
  }

  static async getInitialProps ({ query }) {
    let { id } = query

    if (!id || id < 1) {
      id = 1
    }

    id = parseInt(id)

    return {
      id
    }
  }

  render () {
    let {
      blog,
    } = this.state

    let {
      author,
    } = blog

    return (
      <Page title={this.title}>
        <header className="page-header">
          <h1>{this.title}</h1>
        </header>

        <article className="page-content">
          <header>
            <h2
              className="title"
              dangerouslySetInnerHTML={{ __html: blog.title.rendered }} />
          </header>

          <small>
            <span className="posted-date">
              <i className="fa fa-clock-o fa-fw" />
              Posted <time dateTime={0}>{blog.postedAt.format('DD MMMM, YYYY')}</time>
            </span>

            <span className="author">
              <i className="fa fa-fw fa-user" />

              <Link href={`/blogs/author/${author.id}`}>
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
                      <Link href={`/blogs/category/${id}`}>
                        <a title={description}>{name}</a>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </span>
          </small>

          <div dangerouslySetInnerHTML={{ __html: blog.content.rendered }} />
        </article>
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
  return {}
}

const mapStateToProps = state => {
  return state.blogs
}





export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Blog)
