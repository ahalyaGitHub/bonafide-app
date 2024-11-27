const express = require('express');
const router = express.Router();
const { applyForBonafied, rejectApplication, approveApplication, trackApplicationStatus, getApplication,updateStatus } = require('../controllers/applicationController');

router.get('/', getApplication);
router.put('/:id', updateStatus);

// Route for applying for the Bonafied certificate
router.post('/apply', applyForBonafied);

// Route for rejecting an application 
router.put('/reject', rejectApplication);

// Route for approving an application
router.put('/approve', approveApplication);

// Route for tracking the application status
router.get('/track/:id', trackApplicationStatus);

module.exports = router;
