const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users");

mongoose
  .connect(
    "mongodb+srv://td:YqRJuI8MHwhDtSAL@cluster0.orht9.mongodb.net/message-app?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to Mongo"))
  .catch(() => console.log("Mongo connection failed"));

// middleware for allowing cross posts + headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //allow cross server for all paths
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  ); //means incoming request can have these non default errors
  // NOTE : need to add an extra headers here or it will error eg authorization header were passing
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// body parser for json code - used for parsing incoming request bodies
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// middleware for allowing the image path to be accessible
// path is a nodejs import to create path variables
app.use("/images", express.static(path.join("nodeBackend/images")));
app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes);
module.exports = app;
