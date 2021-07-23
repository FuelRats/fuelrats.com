import { isError } from 'flux-standard-action'
import { useMemo } from 'react'

import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import { getWordpressPage } from '~/store/actions/wordpress'
import { selectWordpressPageBySlug } from '~/store/selectors'
import setError from '~/util/getInitialProps/setError'


const selectPage = (state, props) => {
  return selectWordpressPageBySlug(state, { slug: props.query?.slug }) ?? props.query?.page ?? {}
}


function WordpressProxy (props) {
  const { content } = useSelectorWithProps(props, selectPage)

  const renderedContent = useMemo(() => {
    if (!content?.rendered) {
      return null
    }

    return content.rendered.replace(/<ul>/giu, '<ul class="bulleted">').replace(/<ol>/giu, '<ol class="numbered">')
  }, [content?.rendered])

  if (!renderedContent) {
    return (
      <article className="error page-content" />
    )
  }

  /* eslint-disable react/no-danger */
  return (
    <article className="page-content">
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: renderedContent }} />
    </article>
  )
  /* eslint-enable */
}



WordpressProxy.getInitialProps = async (ctx) => {
  const { query, store } = ctx
  const { slug } = query

  if (!selectWordpressPageBySlug(store.getState(), { slug })) {
    const response = await store.dispatch(getWordpressPage(slug))
    if (isError(response)) {
      setError(ctx, response.meta?.response?.status)
    }
  }
}

WordpressProxy.getPageMeta = ({ store, query }) => {
  const page = selectWordpressPageBySlug(store.getState(), { slug: query.slug })

  return {
    className: 'wordpress-page',
    title: page.title.rendered,
    key: query.slug,
  }
}

export default WordpressProxy
