const express = require('express');
const router = express.Router();
const { getAllDoctors, approveDoctor, getAllPatients, getDashboardStats, getDepartmentStats, toggleUserStatus } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/doctors', getAllDoctors);
router.put('/doctors/:id/approve', approveDoctor);
router.get('/patients', getAllPatients);
router.get('/stats', getDashboardStats);
router.get('/departments', getDepartmentStats);
router.put('/users/:id/toggle-status', toggleUserStatus);

module.exports = router;
