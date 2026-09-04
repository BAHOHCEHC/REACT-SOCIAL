const router = require("express").Router();
const multer = require("multer");
const {
  UserController,
  PostController,
  LikeController,
  CommentController,
  FollowController,
} = require("../controllers");
const authMiddleware = require("../middleware/auth");

//show where files will be stored and how they will be named
const storage = multer.diskStorage({
  destination: "uploads/",
  // destination: function (req, file, cb) {
  //   cb(null, 'uploads/');
  // },
  filename: function (req, file, cb) {
    // cb(null, req.body.name);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// User routes
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/current", authMiddleware, UserController.currentUser);
router.get("/users/:id", authMiddleware, UserController.getUserById);
router.put("/users/:id", authMiddleware, UserController.updateUser);

// post routes
router.post("/posts", authMiddleware, PostController.createPost);
router.get("/posts", authMiddleware, PostController.getAllPosts);
router.get("/posts/:id", authMiddleware, PostController.getPostById);
router.delete("/posts/:id", authMiddleware, PostController.deletePost);

// like routes
router.post("/posts/:postId/like", authMiddleware, LikeController.toggleLike);
router.get("/posts/:postId/likes", authMiddleware, LikeController.getLikesByPost);

// comment routes
router.post("/posts/:postId/comments", authMiddleware, CommentController.createComment);
router.get("/posts/:postId/comments", authMiddleware, CommentController.getCommentsByPost);
router.delete("/comments/:id", authMiddleware, CommentController.deleteComment);

// follow routes
router.post("/users/:id/follow", authMiddleware, FollowController.followUser);
router.get("/users/:id/followers", authMiddleware, FollowController.getFollowers);
router.get("/users/:id/following", authMiddleware, FollowController.getFollowing);

module.exports = router;
