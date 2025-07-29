const MAX_TITLE_LENGTH = 50
const MAX_DESCR_LENGTH = 300

function validatePageMeta (props) {
  if (!props.title?.length) {
    console.error('Pages must contain a unique title')
  }

  if (props.title?.length > MAX_TITLE_LENGTH) {
    console.warn(`Page titles should be fewer than 60 characters, preferably closer to 50. This page's title is ${props.title.length} characters.`)
  }

  if (props.description?.length > MAX_DESCR_LENGTH) {
    console.error(`Page description is too long! The description should be 50-300 characters long, but this page's description is ${props.description.length} characters.`)
  }

  if (props.description && props.description.indexOf('"') !== -1) {
    console.error('Page descriptions shouldn\'t contain double quotes.')
  }
}

export default async function resolvePageMeta (Component, ctx, pageProps) {
  const pageMeta = {
    description: 'The Fuel Rats are Elite: Dangerous\'s premier emergency refueling service. Fueling the galaxy, one ship at a time, since 3301.',
    ...(await Component.getPageMeta?.(ctx, pageProps)) ?? {},
  }

  if ($$BUILD.isDev) {
    validatePageMeta(pageMeta)
  }

  return {
    ...pageMeta,
    className: `${(pageMeta.title ?? 'fuel-rats').toLowerCase().replace(/\s/gu, '-').replace(/'/gu, '')} ${pageMeta.className ?? ''}`,
  }
}
