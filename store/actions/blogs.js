/* eslint no-await-in-loop:off */
// Module imports
import fetch from 'isomorphic-fetch'





// Component imports
import actionTypes from '../actionTypes'





export const retrieveBlog = id => async (dispatch, getState) => {
  dispatch({ type: actionTypes.GET_WORDPRESS_POST })

  const { authors, categories } = getState().blogs

  let response = null
  let success = true

  try {
    response = await fetch(`/wp-api/posts/${id}`)
    response = await response.json()

    if (!authors[response.author.toString()]) {
      fetch(`/wp-api/users/${response.author}`)
        .then(authorResponse => authorResponse.json())
        .then(author => {
          dispatch({
            payload: { ...author },
            status: 'success',
            type: actionTypes.GET_WORDPRESS_AUTHOR,
          })
        }).catch(error => {
          throw error
        })
    }

    response.categories.forEach(categoryId => {
      if (!Object.keys(categories).includes(categoryId.toString())) {
        fetch(`/wp-api/categories/${categoryId}`)
          .then(categoryResponse => categoryResponse.json())
          .then(category => {
            dispatch({
              payload: { ...category },
              status: 'success',
              type: actionTypes.GET_WORDPRESS_CATEGORY,
            })
          }).catch(error => {
            throw error
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

  const { authors: authorCache, categories: catCache } = getState().blogs
  const newAuthors = {}
  const newCategories = {}

  let response = null
  let success = true

  const params = Object.entries(options).reduce((acc, [key, val]) => [...acc, `${key}=${val}`], []).join('&')

  try {
    response = await fetch(`/wp-api/posts?${params}`)
    const headers = await response.headers
    response = await response.json()

    response.forEach(({ author: authorId }) => {
      if (!Object.keys(authorCache).includes(authorId.toString()) && !newAuthors[authorId.toString()]) {
        newAuthors[authorId] = true
        fetch(`/wp-api/users/${authorId}`)
          .then(authorResponse => authorResponse.json())
          .then(author => {
            dispatch({
              payload: { ...author },
              status: 'success',
              type: actionTypes.GET_WORDPRESS_AUTHOR,
            })
          }).catch(error => {
            throw error
          })
      }
    })

    response.forEach(({ categories }) => {
      categories.forEach(catId => {
        if (!Object.keys(catCache).includes(catId.toString()) && !newCategories[catId.toString()]) {
          newCategories[catId] = true

          fetch(`/wp-api/categories/${catId}`)
            .then(categoryResponse => categoryResponse.json())
            .then(category => {
              dispatch({
                payload: { ...category },
                status: 'success',
                type: actionTypes.GET_WORDPRESS_CATEGORY,
              })
            }).catch(error => {
              throw error
            })
        }
      })
    })

    response = {
      blogs: [...response],
      totalPages: parseInt(headers.get('x-wp-totalpages'), 10),
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
