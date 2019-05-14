import { createSelector } from 'reselect'





const selectBlogs = (state) => state.blogs.blogs


const selectBlogAuthors = (state) => state.blogs.authors


const selectBlogCategories = (state) => state.blogs.categories


const selectBlogStatistics = (state) => ({
  total: state.blogs.total,
  totalPages: state.blogs.totalPages,
})

const selectBlogById = createSelector(
  [
    selectBlogs,
    (state, props) => props.blogId,
  ],
  (blogs, blogId) => blogs.find((blog) => (blog.id.toString() === blogId) || (blog.slug === blogId))
)





export {
  selectBlogs,
  selectBlogAuthors,
  selectBlogById,
  selectBlogCategories,
  selectBlogStatistics,
}
