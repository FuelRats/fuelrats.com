// Component imports
import { isError } from 'flux-standard-action'

import actionTypes from '../actionTypes'
import { wpApiRequest } from './services'





export const getAuthor = (authorId) => {
  return wpApiRequest(
    actionTypes.wordpress.authors.read,
    { url: `/users/${authorId}` },
  )
}


export const getCategory = (categoryId) => {
  return wpApiRequest(
    actionTypes.wordpress.categories.read,
    { url: `/categories/${categoryId}` },
  )
}


export const getBlog = (id) => {
  return async (dispatch, getState) => {
    const action = await dispatch(wpApiRequest(
      actionTypes.wordpress.posts.read,
      {
        url: `/posts/${id}`,
      },
    ))

    if (!isError(action)) {
      const {
        author: authorId,
        categories: categoryIds,
      } = action.payload

      const state = getState()
      const { authors, categories } = state.blogs

      if (!authors[authorId]) {
        await dispatch(getAuthor(authorId))
      }

      await Promise.all(categoryIds.map((categoryId) => {
        if (!categories[categoryId]) {
          return dispatch(getCategory(categoryId))
        }
        return Promise.resolve()
      }))
    }

    return dispatch(action)
  }
}


export const getBlogs = (params) => {
  return async (dispatch, getState) => {
    const action = await dispatch(wpApiRequest(
      actionTypes.wordpress.posts.search,
      {
        url: '/posts',
        params,
      },
    ))

    if (!isError(action)) {
      const state = getState()
      const authorCache = { ...state.blogs.authors }
      const categoryCache = { ...state.blogs.categories }

      Object.values(action.payload).forEach(({ author: authorId, categories: categoryIds }) => {
        if (!authorCache[authorId]) {
          authorCache[authorId] = {}
          dispatch(getAuthor(authorId))
        }

        categoryIds.forEach((categoryId) => {
          if (!categoryCache[categoryId]) {
            categoryCache[categoryId] = {}
            dispatch(getCategory(categoryId))
          }
        })
      })
    }

    return action
  }
}
