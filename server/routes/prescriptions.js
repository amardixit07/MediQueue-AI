const express = require('express');
const router = express.Router();
const { createPrescription, getMyPrescriptions, getPrescription, getPrescriptionByAppointment } = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('doctor'), createPrescription);
router.get('/', protect, getMyPrescriptions);
router.get('/:id', protect, getPrescription);
router.get('/appointment/:appointmentId', protect, getPrescriptionByAppointment);

module.exports = router;
