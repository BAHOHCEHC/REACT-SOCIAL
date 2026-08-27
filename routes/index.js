const router = require('express').Router();
const multer = require('multer');
const UserController  = require('../controllers');

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

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/current', UserController.currentUser);
router.get('/users/:id', UserController.getUserById);
router.put('/users/:id', UserController.updateUser);

module.exports = router;
