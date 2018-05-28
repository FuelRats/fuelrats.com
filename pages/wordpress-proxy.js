// Module imports
import React from 'react'
import { connect } from 'react-redux'





// Component imports
import { actions } from '../store'
import Component from '../components/Component'
import PageWrapper from '../components/PageWrapper'




class WordpressProxy extends Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps ({ query, store, res }) {
    const { slug } = query

    if (!store.getState().wordpress.page[slug]) {
      const { status } = await actions.getWordpressPage(slug)(store.dispatch)
      if (status === 'error' && res) {
        res.statusCode = 404
      }
    }
  }

  render () {
    const { page } = this.props
    let title = 'Wordpress Page'
    let content = null

    if (page) {
      title = page.title.rendered
      content = page.content.rendered.replace(/<ul>/gi, '<ul class="bulleted">').replace(/<ol>/gi, '<ol class="numbered">')
    }

    /* eslint-disable react/no-danger */
    return (
      <React.Fragment>
        {Boolean(page) && (
          <PageWrapper
            className="wordpress-page"
            title={title}>
            <article className="page-content">
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: content }} />
            </article>
          </PageWrapper>
        )}

        {!page && (
          <PageWrapper title="Page not Found">
            <article className="error page-content" />
          </PageWrapper>
        )}
      </React.Fragment>
    )
    /* eslint-enable */
  }
}


const mapStateToProps = (state, ownProps) => ({
  page: state.wordpress.page[ownProps.query.slug] || ownProps.query.page || null,
})

export default connect(mapStateToProps)(WordpressProxy)
