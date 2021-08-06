const MAX_TITLE_LENGTH = 50
const MAX_DESCR_LENGTH = 300





export default function loadPageMeta (Component, props) {
  const pageMeta = {
    description: 'The Fuel Rats are Elite: Dangerous\'s premier emergency refueling service. Fueling the galaxy, one ship at a time, since 3301.',
    ...(Component.getPageMeta?.(props.pageProps, props) ?? {}),
  }

  if ($$BUILD.isDev) {
    /* Define plugin scrubs this whole block in production */
    if (!pageMeta.title?.length) {
      console.error('Pages must contain a unique title')
    }

    if (pageMeta.title?.length > MAX_TITLE_LENGTH) {
      console.warn(`Page titles should be fewer than 60 characters, preferably closer to 50. This page's title is ${pageMeta.title.length} characters.`)
    }

    if (pageMeta.description?.length > MAX_DESCR_LENGTH) {
      console.error(`Page description is too long! The description should be 50-300 characters long, but this page's description is ${pageMeta.description.length} characters.`)
    }

    if (pageMeta.description && pageMeta.description.indexOf('"') !== -1) {
      console.error('Page descriptions shouldn\'t contain double quotes.')
    }
  }

  return {
    ...pageMeta,
    className: `${(pageMeta.title ?? 'fuel-rats').toLowerCase().replace(/\s/gu, '-')} ${pageMeta.className ?? ''}`,
  }
}
