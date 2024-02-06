const http = require("http")
const APP = require('./backend/app')  //* EXPRESS APP
const PORT = process.env.PORT | 3000   //* CUSTOM PORT

APP.set('port', PORT)                                                        //* SETTTING PORT
const server = http.createServer(APP)  //* SETTING APP

server.listen(PORT)
