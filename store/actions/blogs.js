// Module imports
import fetch from 'isomorphic-fetch'





// Component imports
import actionTypes from '../actionTypes'





export const retrieveBlogs = (page = 1) => async dispatch => {
  dispatch({ type: actionTypes.RETRIEVE_BLOGS })

  try {
    let response = await fetch(`/wp-api/posts?page=${page}`)
    let blogs = await response.json()
    let headers = await response.headers

    for (let blog of blogs) {
      let authorResponse = await fetch(`/wp-api/users/${blog.author}`)
      authorResponse = await authorResponse.json()

      blog.author = authorResponse.name

      for (let [ key, value ] of blog.categories.entries()) {
        let categoryResponse = await fetch(`/wp-api/categories/${value}`)
        categoryResponse = await categoryResponse.json()

        blog.categories[key] = {
          description: categoryResponse.description,
          name: categoryResponse.name,
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
