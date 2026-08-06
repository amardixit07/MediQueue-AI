const express = require('express');
const router = express.Router();
const { getDoctorQueue, callNextPatient, completeConsultation, skipToken, getPatientPosition } = require('../controllers/queueController');
const { protect, authorize } = require('../middleware/auth');

router.get('/doctor/:doctorId', protect, getDoctorQueue);
router.put('/token/:tokenId/call', protect, authorize('doctor', 'admin'), callNextPatient);
router.put('/token/:tokenId/complete', protect, authorize('doctor', 'admin'), completeConsultation);
router.put('/token/:tokenId/skip', protect, authorize('doctor', 'admin'), skipToken);
router.get('/patient/position', protect, authorize('patient'), getPatientPosition);

module.exports = router;
