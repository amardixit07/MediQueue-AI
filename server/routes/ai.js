const express = require('express');
const router = express.Router();
const { symptomCheck, prescriptionAssist, chat, getDepartments } = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/auth');

router.post('/symptom-check', protect, authorize('patient'), symptomCheck);
router.post('/prescription-assist', protect, authorize('doctor'), prescriptionAssist);
router.post('/chat', protect, chat);
router.get('/departments', getDepartments);

module.exports = router;
