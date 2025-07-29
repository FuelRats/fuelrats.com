import { HttpStatus } from '@fuelrats/web-util/http'
import { isError } from 'flux-standard-action'

import WordpressPage from '~/components/WordpressPage'
import { getWordpressPage } from '~/store/actions/wordpress'
import { selectWordpressPageBySlug } from '~/store/selectors'
import setError from '~/util/getInitialProps/setError'

function WordpressProxy (props) {
  return (
    <article className="page-content">
      <WordpressPage slug={props.query?.slug} />
    </article>
  )
}

WordpressProxy.getInitialProps = async (ctx) => {
  const { query, store } = ctx
  const { slug } = query

  if (!selectWordpressPageBySlug(store.getState(), { slug })) {
    const response = await store.dispatch(getWordpressPage(slug))
    if (!isError(response)) {
      return
    }
    if (!response.payload?.length) {
      setError(ctx, HttpStatus.NOT_FOUND)
      return
    }
    setError(ctx, response.meta?.response?.status)
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
