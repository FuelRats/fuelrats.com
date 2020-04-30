// Component imports
import { HttpStatus } from '../../helpers/HttpStatus'
import wpApi from '../../services/wordpress'
import actionTypes from '../actionTypes'
import initialState from '../initialState'
import { wpApiRequest, createAxiosAction } from './services'





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
    const response = await wpApi.request({
      url: `/posts/${id}`,
    })

    if (HttpStatus.isSuccess(response.status)) {
      const {
        author: authorId,
        categories: categoryIds,
      } = response.data

      const state = getState ? getState() : { ...initialState }
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

    return dispatch(createAxiosAction(actionTypes.wordpress.posts.read, response))
  }
}


export const getBlogs = (params) => {
  return async (dispatch, getState) => {
    const response = await wpApi.request({
      url: '/posts',
      params,
    })

    if (HttpStatus.isSuccess(response.status)) {
      const state = getState ? getState() : { ...initialState }
      const authorCache = { ...state.blogs.authors }
      const categoryCache = { ...state.blogs.categories }

      Object.values(response.data).forEach(({ author: authorId, categories: categoryIds }) => {
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

    return dispatch(createAxiosAction(actionTypes.wordpress.posts.search, response))
  }
}
