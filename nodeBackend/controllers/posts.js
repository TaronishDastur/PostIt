var fs = require("fs");
const Post = require("../models/post");
const path = require("path");

exports.addPost = (req, res, next) => {
  url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    image: {
      data: fs.readFileSync(
        path.join(__dirname, "../images/" + req.file.filename)
      ),
      contentType: req.file.mimetype,
    },
    //   added the middleware which automatically adds the userid to the new post
    createdBy: req.user.userId,
  });
  post
    .save()
    .then((data) =>
      res.status(201).json({
        message: "post add success",
        post: {
          ...data,
          id: data._id,
        },
      })
    )
    .catch((error) => {
      res.status(500).json("post add fail", error);
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, createdBy: req.user.userId })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "post delete success" });
      } else {
        res.status(401).json({
          message: "post delete fail: not authorized",
        });
      }
    })
    .catch(() => res.status(500).json("post delete fail"));
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const pageNumber = +req.query.pageNumber;
  const query = Post.find();
  let resPosts;
  if (pageSize && pageNumber) {
    query.skip(pageSize * (pageNumber - 1)).limit(pageSize);
  }
  query
    .then((posts) => {
      resPosts = posts;
      return Post.estimatedDocumentCount();
    })
    .then((len) =>
      res.status(200).json({
        message: "post get success",
        posts: resPosts,
        length: +len,
      })
    )
    .catch((err) => res.status(500).json("post get fail" + err));
};

exports.getPostById = (req, res, next) => {
  Post.findById(req.params.id).then((post) =>
    post
      ? res.status(200).json({
          message: "post send success",
          post: post,
        })
      : res.status(404).json({
          message: "post send fail : post not found",
          post: null,
        })
  );
};

exports.updatePost = (req, res, next) => {
  let image;
  if (req.file) {
    image = {
      data: fs.readFileSync(
        path.join(__dirname, "../images/" + req.file.filename)
      ),
      contentType: file.mimetype,
    };
  }
  let post = null;
  if (image) {
    post = new Post({
      _id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      image,
    });
  } else {
    post = { $set: { title: req.body.title, content: req.body.content } };
  }
  Post.updateOne({ _id: req.params.id, createdBy: req.user.userId }, post)
    .then((data) => {
      if (data.n > 0) {
        res.status(200).json({
          message: "post update success",
        });
      } else {
        res.status(401).json({
          message: "post update fail: not authorized",
        });
      }
    })
    .catch(() => res.status(500).json("post update fail"));
};
