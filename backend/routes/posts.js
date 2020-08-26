const express = require("express");

const router = express.Router();
const PostsController = require("../controller/posts");
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');


router.post("",checkAuth, extractFile , PostsController.createPost);
router.get("", PostsController.fetchPosts);
router.delete("/:id",checkAuth, PostsController.deletePost);

router.put("/:id",checkAuth, extractFile , PostsController.updatePost);
router.get("/:id", PostsController.fetchPost);

module.exports = router;