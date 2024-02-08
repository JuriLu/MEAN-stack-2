const express = require("express")
const Post = require('../models/postSchema')

const EXPRESS_APP_ROUTER = express.Router();


//? POST
EXPRESS_APP_ROUTER.post('', (
  request,
  response,
  next
) => {
  const post = new Post({
    title: request.body.title,
    content: request.body.content,
  })
  //! SAVES DATA TO DATABASE
  post.save().then(createdPost => {
    response.status(201).json({
      message: 'Post added successfuly',
      postId: createdPost._id
    })
  })
})

//? PUT
EXPRESS_APP_ROUTER.put('/:id', (request, response, next) => {
  const post = new Post({
    _id: request.body.id,
    title: request.body.title,
    content: request.body.content,
  })
  Post.updateOne({_id: request.params.id}, post).then(result => {
    console.log(result)
    response.status(200).json({message: 'Update Successful!'})
  })
})

//? GET one element
EXPRESS_APP_ROUTER.get('/:id', (request, response, next) => {
  Post.findById(request.params.id).then(post => {
    if (post) {
      response.status(200).json(post)
    } else {
      response.status(404).json({message: 'Post not found!'})
    }
  })
})

//? GET
EXPRESS_APP_ROUTER.get('', (
  request,
  response,
  next
) => {
  Post.find().then(documents => {
    response.status(200).json(documents);
  })
})

//? DELETE
EXPRESS_APP_ROUTER.delete( '/:id', (
  request,
  response,
  next) => {
  console.log(request.params.id)
  Post.deleteOne({_id: request.params.id}).then(result => {
    console.log(result)
    response.status(200).json({message: "Post Deleted!"})
  })
})

module.exports = EXPRESS_APP_ROUTER
