const router = require("express").Router();
const multer = require("multer");

//show where files will be stored and how they will be named
const storage = multer.diskStorage({
  destination: 'uploads/',
  // destination: function (req, file, cb) {
  //   cb(null, 'uploads/');
  // },
  filename: function (req, file, cb) {
    // cb(null, req.body.name);
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

router.get("/register", (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

module.exports = router;
