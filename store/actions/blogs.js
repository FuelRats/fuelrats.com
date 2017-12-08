/* eslint no-await-in-loop:off */
// Module imports
import fetch from 'isomorphic-fetch'





// Component imports
import actionTypes from '../actionTypes'





// Cache
const cache = {
  authors: {},
  categories: {},
}





export const retrieveBlog = id => async dispatch => {
  dispatch({ type: actionTypes.RETRIEVE_BLOG })

  try {
    let blogUrl = '/wp-api/posts/'

    if (parseInt(id, 10)) {
      blogUrl += id
    } else {
      blogUrl += `?slug=${id}`
    }

    const response = await fetch(blogUrl)
    let blog = await response.json()

    if (Array.isArray(blog)) {
      [blog] = blog
    }

    blog.id = blog.id.toString()

    let authorResponse = await fetch(`/wp-api/users/${blog.author}`)
    authorResponse = await authorResponse.json()

    blog.author = {
      id: authorResponse.id,
      name: authorResponse.name,
    }

    for (const [key, value] of blog.categories.entries()) {
      let categoryResponse = await fetch(`/wp-api/categories/${value}`)
      categoryResponse = await categoryResponse.json()

      blog.categories[key] = {
        description: categoryResponse.description,
        id: categoryResponse.id,
        name: categoryResponse.name,
      }
    }

    const commentsResponse = await fetch(`/wp-api/comments?post=${id}`)
    blog.comments = await commentsResponse.json()
    blog.comments = blog.comments || []

    dispatch({
      payload: blog,
      status: 'success',
      type: actionTypes.RETRIEVE_BLOG,
    })
  } catch (error) {
    dispatch({
      payload: error,
      status: 'error',
      type: actionTypes.RETRIEVE_BLOG,
    })
  }
}





export const retrieveBlogs = (options) => async dispatch => {
  dispatch({ type: actionTypes.RETRIEVE_BLOGS })

  const queryParams = []

  for (const option in options) {
    if ({}.hasOwnProperty.call(options, option)) {
      queryParams.push(`${option}=${options[option]}`)
    }
  }

  try {
    const response = await fetch(`/wp-api/posts?${queryParams.join('&')}`)
    const blogs = await response.json()
    const headers = await response.headers

    for (const blog of blogs) {
      if (cache.authors[blog.author]) {
        blog.author = cache.authors[blog.author]
      } else {
        let authorResponse = await fetch(`/wp-api/users/${blog.author}`)
        authorResponse = await authorResponse.json()

        cache.authors[blog.author] = blog.author = {
          id: authorResponse.id,
          name: authorResponse.name,
        }
      }

      for (const [key, value] of blog.categories.entries()) {
        if (cache.categories[value]) {
          blog.categories[key] = cache.categories[value]
        } else {
          let categoryResponse = await fetch(`/wp-api/categories/${value}`)
          categoryResponse = await categoryResponse.json()

          cache.categories[value] = blog.categories[key] = {
            description: categoryResponse.description,
            id: categoryResponse.id,
            name: categoryResponse.name,
          }
        }
      }
    }

    dispatch({
      payload: {
        blogs,
        totalPages: parseInt(headers.get('x-wp-totalpages'), 10),
      },
      status: 'success',
      type: actionTypes.RETRIEVE_BLOGS,
    })
  } catch (error) {
    dispatch({
      payload: error,
      status: 'error',
      type: actionTypes.RETRIEVE_BLOGS,
    })
  }
}
