const selectWordpressPages = (state) => state.wordpress.page


const selectWordpressPageBySlug = (state, { slug }) => state.wordpress.page[slug]





export {
  selectWordpressPages,
  selectWordpressPageBySlug,
}
