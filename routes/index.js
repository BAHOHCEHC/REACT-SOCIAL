const router = require("express").Router();
const multer = require("multer");
const UserController = require("../controllers");
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

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/current", authMiddleware, UserController.currentUser);
router.get("/users/:id", authMiddleware, UserController.getUserById);
router.put("/users/:id", authMiddleware, UserController.updateUser);

module.exports = router;
