const express = require("express");
const auth = require("../middleware/auth");
const multerExtract = require("../middleware/multer");

const postController = require("../controllers/posts");
const router = express.Router();

// post request - adding a post
router.post("", auth, multerExtract, postController.addPost);

// deleting a post - send id as dynamic path segment
// access the dynamic id using req.params.id
router.delete("/:id", auth, postController.deletePost);

// sending the request - list of posts
// can also use router.get
router.get("", postController.getPosts);

// sending the request - get list of posts based on the id
// can also use router.get
router.get("/:id", postController.getPostById);

// updating a request
// using a put request here
router.put("/:id", auth, multerExtract, postController.updatePost);

module.exports = router;
