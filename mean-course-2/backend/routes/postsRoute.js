const express = require("express")
const multer = require('multer')
const Post = require('../models/postSchema')

const EXPRESS_APP_ROUTER = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype]
    let error = new Error("Invalid mime type")
    if (isValid) {
      error = null
    }
    callback(error, "backend/images",)
  },
  filename: (request, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-')
    const extension = MIME_TYPE_MAP[file.mimetype]
    callback(null, name + '-' + Date.now() + '.' + extension)
  }
})

EXPRESS_APP_ROUTER.post('',
  multer({storage}).single('image'),
  (request, response, next) => {
    const serverUrl = request.protocol + '://' + request.get('host')
    const post = new Post({
      title: request.body.title,
      content: request.body.content,
      imagePath: serverUrl + '/images/' + request.file.filename
    })
    post.save().then(createdPost => {
      response.status(201).json({
        message: 'Post added successfuly',
        post: createdPost
      })
    })
  })

//? PUT
EXPRESS_APP_ROUTER.put('/:id',
  multer({storage}).single('image'),
  (request, response, next) => {
    let imagePath = request.body.imagePath;
    if (request.file) {
      const serverUrl = request.protocol + '://' + request.get('host')
      imagePath = serverUrl + '/images/' + request.file.filename
    }
    const post = new Post({
      _id: request.body.id,
      title: request.body.title,
      content: request.body.content,
      imagePath: imagePath
    })

    Post.updateOne({_id: request.params.id}, post).then(updatedPost => {
      response.status(200).json({message: 'Update Successful!', post})
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
EXPRESS_APP_ROUTER.get('', (request, response, next) => {
  Post.find().then(documents => {
    response.status(200).json(documents);
  })
})

//? DELETE
EXPRESS_APP_ROUTER.delete('/:id', (request, response, next) => {
  Post.deleteOne({_id: request.params.id}).then(result => {
    response.status(200).json({message: "Post Deleted!"})
  })
})

module.exports = EXPRESS_APP_ROUTER
