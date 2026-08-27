import clsx from 'clsx'
import PropTypes from 'prop-types'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useToggleState from '~/hooks/useToggleState'
import { getWordpressPage } from '~/store/actions/wordpress'
import { selectWordpressPageBySlug } from '~/store/selectors'




function WordpressPage ({ className, slug }) {
  const page = useSelector((state) => {
    return selectWordpressPageBySlug(state, { slug })
  })
  const [loading, toggleLoading] = useToggleState(true)

  const dispatch = useDispatch()

  useEffect(() => {
    const checkPageExistance = async () => {
      if (!page) {
        toggleLoading(true)
        await dispatch(getWordpressPage(slug))
      }
      toggleLoading(false)
    }
    checkPageExistance()
  // eslint-disable-next-line react-hooks/exhaustive-deps -- only run on slug change.
  }, [slug])

  const renderedContent = useMemo(() => {
    if (!page?.content?.rendered) {
      return undefined
    }

    return page.content.rendered
      .replace(/<ul>/giu, '<ul class="bulleted">')
      .replace(/<ol>/giu, '<ol class="numbered">')
  }, [page?.content?.rendered])

  const hasError = !renderedContent && !loading

  /* eslint-disable react/no-danger */
  return (
    <div className={clsx('article-content loading', { error: hasError }, className)}>
      {
        hasError
          ? <p>{'Failed to load content. Please refresh and try again.'}</p>
          : <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
      }
    </div>
  )
  /* eslint-enable */
}

WordpressPage.propTypes = {
  className: PropTypes.string,
  slug: PropTypes.string.isRequired,
}





export default WordpressPage
