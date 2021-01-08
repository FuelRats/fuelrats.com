import { createSelector } from 'reselect'





const getBlogId = (_, props) => {
  return props.blogId
}





export const selectBlogs = (state) => {
  return state.blogs.blogs
}


export const selectBlogAuthors = (state) => {
  return state.blogs.authors
}


export const selectBlogCategories = (state) => {
  return state.blogs.categories
}


export const selectBlogStatistics = (state) => {
  return {
    total: state.blogs.total,
    totalPages: state.blogs.totalPages,
  }
}

export const selectBlogById = createSelector(
  [selectBlogs, getBlogId],
  (blogs, blogId) => {
    return blogs.find((blog) => {
      return (blog.id.toString() === blogId.toString()) || (blog.slug === blogId)
    })
  },
)

export const selectAuthorByBlogId = createSelector(
  [selectBlogById, selectBlogAuthors],
  (blog, authors) => {
    if (!blog?.author) {
      return undefined
    }

    return authors[blog.author] || {
      id: blog.author,
    }
  },
)

export const selectCategoriesByBlogId = createSelector(
  [selectBlogById, selectBlogCategories],
  (blog, categories) => {
    if (!blog?.categories) {
      return []
    }

    return blog.categories.map((categoryId) => {
      return categories[categoryId] || {
        id: categoryId,
      }
    })
  },
)
