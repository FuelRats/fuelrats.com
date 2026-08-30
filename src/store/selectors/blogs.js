import { createCachedSelector } from 're-reselect'




const getBlogId = (_, props) => {
  return props?.blogId
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
    totalPages: state.blogs.totalPages,
  }
}

export const selectBlogById = createCachedSelector(
  [selectBlogs, getBlogId],
  (blogs, blogId) => {
    return blogs.find((blog) => {
      return (blog.id.toString() === blogId.toString()) || (blog.slug === blogId)
    })
  },
)(getBlogId)

export const selectAuthorByBlogId = createCachedSelector(
  [selectBlogById, selectBlogAuthors],
  (blog, authors) => {
    if (!blog?.author) {
      return undefined
    }

    return authors[blog.author] || {
      id: blog.author,
    }
  },
)(getBlogId)

export const selectCategoriesByBlogId = createCachedSelector(
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
)(getBlogId)
