const express = require('express')
const bodyParser = require("body-parser")
const EXPRESS_APP = express() //* THIS WILL RETURN A EXPRESS APP  (This is a big chain of middleware)
const Post = require('./models/post')

//? Mongoose library + Mongo Db connection
const mongoose = require('mongoose');
const uri = "mongodb+srv://juriikub:7WRi6fFo5Pf9Adiv@mean-stack-cluster.8zzjpl8.mongodb.net/node-angular?retryWrites=true&w=majority";
const clientOptions = {serverApi: {version: '1', strict: true, deprecationErrors: true}};

async function run() {
    try {
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}

run().catch(console.dir);
//? Mongoose library + Mongo Db connection

EXPRESS_APP.use(bodyParser.json())
EXPRESS_APP.use(bodyParser.urlencoded({extended: false})) //* XTRA FEATURE OF BODY PARSER
EXPRESS_APP.use((request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next()
})

//? POST
EXPRESS_APP.post("/api/posts", (
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

EXPRESS_APP.put("/api/posts/:id", (request, response, next) => {
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

//? GET
EXPRESS_APP.get('/api/posts', (
    request,
    response,
    next
) => {
    Post.find().then(documents => {
        response.status(200).json(documents);
    })
})

//? DELETE
EXPRESS_APP.delete('/api/posts/:id', (
    request,
    response,
    next) => {
    console.log(request.params.id)
    Post.deleteOne({_id: request.params.id}).then(result => {
        console.log(result)
        response.status(200).json({message: "Post Deleted!"})
    })
})

module.exports = EXPRESS_APP; //* WE NEED TO EXPORT , SO IT CAN BE USED AS A LISTENER TO server.js
