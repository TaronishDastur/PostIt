const app = require("./app");
const debug = require("debug")("node-angular");
const http = require("http"); //import http package

//NOTE start server nodemon using npm run start:server
// makes sure that when we try to setup a port and recieve it though envt var
// make sure its valid number
const normalizePort = (val) => {
  var port = parseInt(val, 10);

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

// check error and show error message instead of breaking
const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
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

// output or log that we are now listening to the requests
const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
  console.log("Listening on " + bind);
};

// setting the port and setting it on express app
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// set listeners for listening and errors and start the server
const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
