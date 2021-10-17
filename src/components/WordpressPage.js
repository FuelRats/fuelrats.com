import PropTypes from 'prop-types'
import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'

import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import useToggleState from '~/hooks/useToggleState'
import { getWordpressPage } from '~/store/actions/wordpress'
import { selectWordpressPageBySlug } from '~/store/selectors'





// Component Constants





function WordpressPage ({ className, slug }) {
  const page = useSelectorWithProps({ slug }, selectWordpressPageBySlug)
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

  /* eslint-disable react/no-danger */
  return (
    <div
      className={['article-content loading', { error: !renderedContent && !loading }, className]}
      dangerouslySetInnerHTML={{ __html: renderedContent }} />
  )
  /* eslint-enable */
}

WordpressPage.propTypes = {
  className: PropTypes.string,
  slug: PropTypes.string.isRequired,
}





export default WordpressPage
