const express = require('express')

const EXPRESS_APP = express() //* THIS WILL RETURN A EXPRESS APP  (This is a big chain of middleware)

//? FIRST MIDDLEWARE
EXPRESS_APP.use(
  (
    request,
    response,
    next
  ) => {
    console.log('First Middleware');
    next(); //! WITHOUT THIS NEXT HERE IT WON'T PASS TO THE OTHER MIDDLEWARE,ALWAYS CALL NEXT IF YOU ARE NOT SENDING A RESPONSE
  })


//? SECOND MIDDLEWARE
EXPRESS_APP.use(
  (
    request,
    response,
    next
  ) => {
    response.send('Hello from express');
  })


module.exports = EXPRESS_APP; //* WE NEED TO EXPORT , SO IT CAN BE USED AS A LISTENER TO server.js
