const path = require('path')
const express = require('express')
const bodyParser = require("body-parser")
const postsRoutes = require('./routes/postsRoute')

const EXPRESS_APP = express() //* THIS WILL RETURN A EXPRESS APP  (This is a big chain of middleware)
const POSTS_ENDPOINT = "/api/posts"


//? Mongoose library + Mongo Db connection
const mongoose = require('mongoose');
const {response} = require("express");
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
EXPRESS_APP.use("/images",express.static(path.join('backend/images')))
EXPRESS_APP.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next()
})

EXPRESS_APP.use(POSTS_ENDPOINT,postsRoutes)


module.exports = EXPRESS_APP; //* WE NEED TO EXPORT , SO IT CAN BE USED AS A LISTENER TO server.js
