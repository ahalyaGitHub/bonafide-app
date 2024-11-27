const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const studentController = require('../controllers/studentController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../frontend/public/uploads')); // Store images in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp as filename
    }
});

const upload = multer({ storage: storage });

router.post('/', studentController.addStudent);
router.post('/login', studentController.loginStudent);
router.get('/profile/:id', studentController.getProfile);
router.put('/profile/:id', upload.single('imageUrl'), studentController.updateProfile);

module.exports = router;
