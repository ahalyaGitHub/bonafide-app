const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

router.post('/',staffController.addStaff);
router.post('/login',staffController.loginStaff);

module.exports = router;