const http = require("http")

const server = http.createServer(
  (request, response) => {
    response.end('This is my first response')
  })

server.listen(process.env.PORT | 3000)
