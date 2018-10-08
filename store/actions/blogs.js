// Component imports
import actionTypes from '../actionTypes'
import wpService from '../../services/wordpress'





// Component constants
const wpFetch = url => wpService().request({ url })





export const retrieveBlog = id => async (dispatch, getState) => {
  dispatch({ type: actionTypes.GET_WORDPRESS_POST })

  const { authors, categories } = getState().blogs

  let response = null
  let success = true

  try {
    response = await wpFetch(`/posts/${id}`)
    response = response.data

    if (!authors[response.author]) {
      wpFetch(`/users/${response.author}`).then(({ data: payload }) => {
        dispatch({
          payload,
          status: 'success',
          type: actionTypes.GET_WORDPRESS_AUTHOR,
        })
      }).catch(({ response: payload }) => {
        dispatch({
          payload,
          status: 'error',
          type: actionTypes.GET_WORDPRESS_AUTHOR,
        })
      })
    }

    response.categories.forEach(categoryId => {
      if (!Object.keys(categories).includes(categoryId)) {
        wpFetch(`/categories/${categoryId}`).then(({ data: payload }) => {
          dispatch({
            payload,
            status: 'success',
            type: actionTypes.GET_WORDPRESS_CATEGORY,
          })
        }).catch(({ response: payload }) => {
          dispatch({
            payload,
            status: 'error',
            type: actionTypes.GET_WORDPRESS_CATEGORY,
          })
        })
      }
    })
  } catch (error) {
    response = error
    success = false
  }

  dispatch({
    payload: response,
    status: success ? 'success' : 'error',
    type: actionTypes.GET_WORDPRESS_POST,
  })
}





export const retrieveBlogs = options => async (dispatch, getState) => {
  dispatch({ type: actionTypes.GET_WORDPRESS_POSTS })

  const { blogs } = getState()
  const authorCache = { ...blogs.authors }
  const categoryCache = { ...blogs.categories }

  let response = null
  let success = true

  const params = Object.entries(options).reduce((acc, [key, val]) => [...acc, `${key}=${val}`], []).join('&')

  try {
    response = await wpFetch(`/posts?${params}`)
    const headers = { ...response.headers }
    response = { ...response.data }

    // Gather Author and category information
    Object.values(response).forEach(({ author: authorId, categories }) => {
      if (!authorCache[authorId]) {
        authorCache[authorId] = {}

        wpFetch(`/users/${authorId}`).then(({ data: payload }) => {
          dispatch({
            payload,
            status: 'success',
            type: actionTypes.GET_WORDPRESS_AUTHOR,
          })
        }).catch(({ response: payload }) => {
          dispatch({
            payload,
            status: 'error',
            type: actionTypes.GET_WORDPRESS_AUTHOR,
          })
        })
      }

      categories.forEach(catId => {
        if (!categoryCache[catId]) {
          categoryCache[catId] = {}

          wpFetch(`/categories/${catId}`).then(({ data: payload }) => {
            dispatch({
              payload,
              status: 'success',
              type: actionTypes.GET_WORDPRESS_CATEGORY,
            })
          }).catch(({ response: payload }) => {
            dispatch({
              payload,
              status: 'error',
              type: actionTypes.GET_WORDPRESS_CATEGORY,
            })
          })
        }
      })
    })

    response = {
      blogs: [...Object.values(response)],
      totalPages: parseInt(headers['x-wp-totalpages'], 10),
    }
  } catch (error) {
    response = error
    success = false
  }

  dispatch({
    payload: response,
    status: success ? 'success' : 'error',
    type: actionTypes.GET_WORDPRESS_POSTS,
  })
}
