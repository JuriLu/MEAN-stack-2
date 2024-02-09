const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  //* title: String   CAN LEAVE ALSO LIKE THIS
  title: {type: String, required: true},
  content: {type: String, required: true},
  imagePath: {type: String, required: true},
})

module.exports =  mongoose.model('Post',postSchema)
