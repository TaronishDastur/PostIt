const Post = require("../models/post");

exports.addPost = (req, res, next) => {
  //   set the url for file location
  url = req.protocol + "://" + req.get("host");
  // console.log("AA", req.body);
  // console.log(req.file);
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    image: req.file,
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
      console.log(error), res.status(500).json("post add fail");
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
    .catch(() => res.status(500).json("post get fail"));
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
  let imagePath = req.body?.imagePath;
  if (req.file) {
    imagePath =
      req.protocol + "://" + req.get("host") + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath,
  });
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
