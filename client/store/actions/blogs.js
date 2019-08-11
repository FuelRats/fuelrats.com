// Component imports
import { wpApiRequest, createAxiosAction } from './services'
import actionTypes from '../actionTypes'
import httpStatus from '../../helpers/httpStatus'
import initialState from '../initialState'
import wpApi from '../../services/wordpress'





export const getAuthor = (authorId) => wpApiRequest(
  actionTypes.GET_WORDPRESS_AUTHOR,
  { url: `/users/${authorId}` }
)





export const getCategory = (categoryId) => wpApiRequest(
  actionTypes.GET_WORDPRESS_CATEGORY,
  { url: `/categories/${categoryId}` }
)





export const getBlog = (id) => async (dispatch, getState) => {
  const response = await wpApi.request({
    url: `/posts/${id}`,
  })

  if (httpStatus.isSuccess(response.status)) {
    const {
      author: authorId,
      categories: categoryIds,
    } = response.data

    const state = getState ? getState() : { ...initialState }
    const { authors, categories } = state.blogs

    if (!authors[authorId]) {
      await getAuthor(authorId)(dispatch)
    }

    await Promise.all(categoryIds.map((categoryId) => {
      if (!categories[categoryId]) {
        return getCategory(categoryId)(dispatch)
      }
      return Promise.resolve()
    }))
  }

  return dispatch(createAxiosAction(actionTypes.GET_WORDPRESS_POST, response))
}





export const getBlogs = (params) => async (dispatch, getState) => {
  const response = await wpApi.request({
    url: '/posts',
    params,
  })

  if (httpStatus.isSuccess(response.status)) {
    const state = getState ? getState() : { ...initialState }
    const authorCache = { ...state.blogs.authors }
    const categoryCache = { ...state.blogs.categories }

    Object.values(response.data).forEach(({ author: authorId, categories: categoryIds }) => {
      if (!authorCache[authorId]) {
        authorCache[authorId] = {}
        getAuthor(authorId)(dispatch)
      }

      categoryIds.forEach((categoryId) => {
        if (!categoryCache[categoryId]) {
          categoryCache[categoryId] = {}
          getCategory(categoryId)(dispatch)
        }
      })
    })
  }

  return dispatch(createAxiosAction(actionTypes.GET_WORDPRESS_POSTS, response))
}
