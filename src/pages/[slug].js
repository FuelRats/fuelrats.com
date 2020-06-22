// Module imports
import { HttpStatus } from '@fuelrats/web-util/http'
import { isError } from 'flux-standard-action'
import React from 'react'





// Component imports
import { setError } from '~/helpers/gIPTools'
import { actions, connect } from '~/store'
import { selectWordpressPageBySlug } from '~/store/selectors'





@connect
class WordpressProxy extends React.Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps (ctx) {
    const { query, store } = ctx
    const { slug } = query

    if (!selectWordpressPageBySlug(store.getState(), { slug })) {
      const response = await store.dispatch(actions.getWordpressPage(slug))

      if (isError(response)) {
        setError(ctx, HttpStatus.NOT_FOUND)
      }
    }
  }

  static getPageMeta ({ store, query }) {
    const page = selectWordpressPageBySlug(store.getState(), { slug: query.slug })

    return {
      className: 'wordpress-page',
      title: page.title.rendered,
    }
  }

  render () {
    const { page } = this.props
    let content = null

    if (page) {
      content = page.content.rendered.replace(/<ul>/giu, '<ul class="bulleted">').replace(/<ol>/giu, '<ol class="numbered">')
    }

    /* eslint-disable react/no-danger */
    return (
      <>
        {
          Boolean(page) && (
            <article className="page-content">
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: content }} />
            </article>
          )
        }
        {
          !page && (
            <article className="error page-content" />
          )
        }
      </>
    )
    /* eslint-enable */
  }

  static mapStateToProps = (state, ownProps) => {
    return {
      page: selectWordpressPageBySlug(state, { slug: ownProps.query?.slug }) || ownProps.query.page || null,
    }
  }
}

export default WordpressProxy
