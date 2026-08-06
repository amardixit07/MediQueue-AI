const express = require('express');
const router = express.Router();
const { bookAppointment, getMyAppointments, getAppointment, updateStatus, cancelAppointment, getDoctorSlots } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('patient'), bookAppointment);
router.get('/', protect, getMyAppointments);
router.get('/:id', protect, getAppointment);
router.put('/:id/status', protect, authorize('doctor', 'admin'), updateStatus);
router.delete('/:id', protect, authorize('patient'), cancelAppointment);
router.get('/doctor/:doctorId/slots', protect, getDoctorSlots);

module.exports = router;
