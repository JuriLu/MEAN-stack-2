const express = require("express")
const multer = require('multer')
const Post = require('../models/postSchema')

const EXPRESS_APP_ROUTER = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
}

//? Image management
const storage = multer.diskStorage({
  //? destination runs when multer saves a file
  destination: (request, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype]
    let error = new Error("Invalid mime type")
    if (isValid) {
      error = null
    }
    callback(error, "backend/images",)    //* 1st argument is if detected an error(null), 2nd is a string with the path where is will be stored (relative to server.js file)
  },
  filename: (request, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-')
    const extension = MIME_TYPE_MAP[file.mimetype]
    callback(null, name + '-' + Date.now() + '.' + extension)
  }
})

//? POST
EXPRESS_APP_ROUTER.post('', multer({storage}).single('image'), (
  request,
  response,
  next
) => {
  const serverUrl = request.protocol + '://' + request.get('host')
  const post = new Post({
    title: request.body.title,
    content: request.body.content,
    imagePath: serverUrl + '/images/' + request.file.filename
  })
  //! SAVES DATA TO DATABASE
  post.save().then(createdPost => {
    response.status(201).json({
      message: 'Post added successfuly',
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath,
      }
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
EXPRESS_APP_ROUTER.delete('/:id', (
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
