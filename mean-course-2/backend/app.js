const express = require('express')

const EXPRESS_APP = express() //* THIS WILL RETURN A EXPRESS APP  (This is a big chain of middleware)

EXPRESS_APP.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next()
})

EXPRESS_APP.use('/api/posts',
  (
    request,
    response,
    next
  ) => {
    const posts = [
      {
        id: 1,
        get title() {
          return `Server-Side-Post-${this.id}`
        },
        content: 'This is coming from Server'
      },
      {
        id: 2,
        get title() {
          return `Server-Side-Post-${this.id}`
        },
        content: 'This is coming from Server'
      },
      {
        id: 3,
        get title() {
          return `Server-Side-Post-${this.id}`
        },
        content: 'This is coming from Server'
      },
    ]
    response.status(200).json(posts);
  })


module.exports = EXPRESS_APP; //* WE NEED TO EXPORT , SO IT CAN BE USED AS A LISTENER TO server.js
