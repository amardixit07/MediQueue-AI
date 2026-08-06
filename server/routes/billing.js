const express = require('express');
const router = express.Router();
const { generateBill, getMyBills, getBill, payBill, cancelBill } = require('../controllers/billingController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('doctor', 'admin'), generateBill);
router.get('/', protect, getMyBills);
router.get('/:id', protect, getBill);
router.put('/:id/pay', protect, authorize('admin'), payBill);
router.put('/:id/cancel', protect, authorize('admin'), cancelBill);

module.exports = router;
