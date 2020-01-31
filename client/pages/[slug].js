// Module imports
import React from 'react'





// Component imports
import { PageWrapper } from '../components/AppLayout'
import { actions, connect, actionStatus } from '../store'
import { selectWordpressPageBySlug } from '../store/selectors'



@connect
class WordpressProxy extends React.Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps ({ query, store, res }) {
    const { slug } = query

    if (!selectWordpressPageBySlug(store.getState(), { slug })) {
      const { status } = await actions.getWordpressPage(slug)(store.dispatch)

      if (status === actionStatus.ERROR && res) {
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
      content = page.content.rendered.replace(/<ul>/giu, '<ul class="bulleted">').replace(/<ol>/giu, '<ol class="numbered">')
    }

    /* eslint-disable react/no-danger */
    return (
      <>
        {
          Boolean(page) && (
            <PageWrapper
              className="wordpress-page"
              title={title}>
              <article className="page-content">
                <div
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: content }} />
              </article>
            </PageWrapper>
          )
        }
        {
          !page && (
            <PageWrapper title="Page not Found">
              <article className="error page-content" />
            </PageWrapper>
          )
        }
      </>
    )
    /* eslint-enable */
  }

  static mapStateToProps = (state, ownProps) => ({
    page: selectWordpressPageBySlug(state, { slug: ownProps.query.slug }) || ownProps.query.page || null,
  })
}

export default WordpressProxy
