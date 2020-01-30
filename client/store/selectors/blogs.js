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
  (blogs, blogId) => blogs.find((blog) => (blog.id.toString() === blogId.toString()) || (blog.slug === blogId)),
)

const selectAuthorByBlogId = createSelector(
  [selectBlogById, selectBlogAuthors],
  (blog, authors) => {
    if (!blog?.author) {
      return null
    }

    return authors[blog.author] || {
      id: blog.author,
    }
  },
)

const selectCategoriesByBlogId = createSelector(
  [selectBlogById, selectBlogCategories],
  (blog, categories) => {
    if (!blog?.categories) {
      return []
    }

    return blog.categories.map((categoryId) => categories[categoryId] || {
      id: categoryId,
    })
  },
)

export {
  selectAuthorByBlogId,
  selectBlogs,
  selectBlogAuthors,
  selectBlogById,
  selectBlogCategories,
  selectBlogStatistics,
  selectCategoriesByBlogId,
}
