export const selectWordpressPages = (state) => {
  return state.wordpress.pages
}


export const selectWordpressPageBySlug = (state, { slug }) => {
  return state.wordpress.pages[slug]
}
