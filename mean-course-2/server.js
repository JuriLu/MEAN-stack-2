const APP = require('./backend/app')  //* EXPRESS APP
const http = require("http")
const debug = require("debug")("node-angular");
const normalizePort = val => {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr;
  debug("Listening on " + bind);
};

const PORT = normalizePort(process.env.PORT || "3000");
APP.set("port", PORT);

const server = http.createServer(APP);
server.on("error", onError);
server.on("listening", onListening);
server.listen(PORT);
