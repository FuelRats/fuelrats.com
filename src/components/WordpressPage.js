import PropTypes from 'prop-types'
import { useMemo } from 'react'

import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import { selectWordpressPageBySlug } from '~/store/selectors'





// Component Constants





function WordpressPage ({ className, slug }) {
  const { content } = useSelectorWithProps({ slug }, selectWordpressPageBySlug) ?? {}

  const renderedContent = useMemo(() => {
    if (!content?.rendered) {
      return null
    }

    return content.rendered
      .replace(/<ul>/giu, '<ul class="bulleted">')
      .replace(/<ol>/giu, '<ol class="numbered">')
  }, [content?.rendered])

  if (!renderedContent) {
    return null
  }

  /* eslint-disable react/no-danger */
  return (
    <div
      className={['article-content', className]}
      dangerouslySetInnerHTML={{ __html: renderedContent }} />
  )
  /* eslint-enable */
}

WordpressPage.propTypes = {
  className: PropTypes.string,
  slug: PropTypes.string.isRequired,
}





export default WordpressPage
