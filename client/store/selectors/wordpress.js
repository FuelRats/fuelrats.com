const selectWordpressPages = (state) => state.wordpress.pages


const selectWordpressPageBySlug = (state, { slug }) => state.wordpress.pages[slug]





export {
  selectWordpressPages,
  selectWordpressPageBySlug,
}
