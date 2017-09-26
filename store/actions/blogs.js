// Module imports
import fetch from 'isomorphic-fetch'





// Component imports
import actionTypes from '../actionTypes'





// Cache
const cache = {
  authors: {},
  categories: {}
}





export const retrieveBlog = id => async dispatch => {
  dispatch({ type: actionTypes.RETRIEVE_BLOG })

  try {
    let response = await fetch(`/wp-api/posts/${id}`)
    let blog = await response.json()

    let authorResponse = await fetch(`/wp-api/users/${blog.author}`)
    authorResponse = await authorResponse.json()

    blog.author = {
      id: authorResponse.id,
      name: authorResponse.name,
    }

    for (let [ key, value ] of blog.categories.entries()) {
      let categoryResponse = await fetch(`/wp-api/categories/${value}`)
      categoryResponse = await categoryResponse.json()

      blog.categories[key] = {
        description: categoryResponse.description,
        id: categoryResponse.id,
        name: categoryResponse.name,
      }
    }

    let commentsResponse = await fetch(`/wp-api/comments?post=${id}`)
    blog.comments = await commentsResponse.json()
    blog.comments || (blog.comments = [])

    dispatch({
      payload: blog,
      status: 'success',
      type: actionTypes.RETRIEVE_BLOG,
    })

  } catch (error) {
    dispatch({
      status: 'error',
      type: actionTypes.RETRIEVE_BLOG,
    })

    console.log(error)
  }
}





export const retrieveBlogs = (options) => async dispatch => {
  dispatch({ type: actionTypes.RETRIEVE_BLOGS })

  let queryParams = []

  for (let option in options) {
    queryParams.push(`${option}=${options[option]}`)
  }

  try {
    let response = await fetch(`/wp-api/posts?${queryParams.join('&')}`)
    let blogs = await response.json()
    let headers = await response.headers

    for (let blog of blogs) {
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

      for (let [ key, value ] of blog.categories.entries()) {
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
        blogs: blogs,
        totalPages: parseInt(headers.get('x-wp-totalpages')),
      },
      status: 'success',
      type: actionTypes.RETRIEVE_BLOGS,
    })

  } catch (error) {
    dispatch({
      status: 'error',
      type: actionTypes.RETRIEVE_BLOGS,
    })

    console.log(error)
  }
}
