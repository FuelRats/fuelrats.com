// Component imports
import { createWpAction } from '../actionCreators'
import actionTypes from '../actionTypes'
import initialState from '../initialState'





export const retrieveAuthor = (authorId) => createWpAction({
  actionType: actionTypes.GET_WORDPRESS_AUTHOR,
  url: `/users/${authorId}`,
})





export const retrieveCategory = (categoryId) => createWpAction({
  actionType: actionTypes.GET_WORDPRESS_CATEGORY,
  url: `/categories/${categoryId}`,
})





export const retrieveBlog = (id) => createWpAction({
  actionType: actionTypes.GET_WORDPRESS_POST,
  url: `/posts/${id}`,
  onSuccess: async ({ data: { author: authorId, categories: categoryIds } }, { dispatch, getState }) => {
    const state = getState ? getState() : { ...initialState }
    const { authors, categories } = state.blogs

    if (!authors[authorId]) {
      await retrieveAuthor(authorId)(dispatch)
    }

    await Promise.all(categoryIds.map((categoryId) => {
      if (!categories[categoryId]) {
        return retrieveCategory(categoryId)(dispatch)
      }
      return Promise.resolve()
    }))
  },
})





export const retrieveBlogs = (params) => createWpAction({
  actionType: actionTypes.GET_WORDPRESS_POSTS,
  url: '/posts',
  params,
  onSuccess: ({ data: blogs, headers }, { dispatch, getState }) => {
    const state = getState ? getState() : { ...initialState }
    const authorCache = { ...state.blogs.authors }
    const categoryCache = { ...state.blogs.categories }

    Object.values(blogs).forEach(({ author: authorId, categories: categoryIds }) => {
      if (!authorCache[authorId]) {
        authorCache[authorId] = {}
        retrieveAuthor(authorId)(dispatch)
      }

      categoryIds.forEach((categoryId) => {
        if (!categoryCache[categoryId]) {
          categoryCache[categoryId] = {}
          retrieveCategory(categoryId)(dispatch)
        }
      })
    })

    return {
      blogs,
      totalPages: parseInt(headers['x-wp-totalpages'], 10),
    }
  },
})
