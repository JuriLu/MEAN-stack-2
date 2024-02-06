const express = require('express')
const bodyParser = require("body-parser")
const EXPRESS_APP = express() //* THIS WILL RETURN A EXPRESS APP  (This is a big chain of middleware)

EXPRESS_APP.use(bodyParser.json())
EXPRESS_APP.use(bodyParser.urlencoded({extended: false})) //* XTRA FEATURE OF BODY PARSER
EXPRESS_APP.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next()
})

EXPRESS_APP.post("/api/posts", (
  request,
  response,
  next) => {
  const post = request.body
  console.log(post)
  response.status(201).json({
    message: 'Post added successfuly'
  })
})

EXPRESS_APP.get('/api/posts',
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
