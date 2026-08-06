const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  billNumber: { type: String, required: true, unique: true },
  items: [{
    description: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  taxRate: { type: Number, default: 18 },
  taxAmount: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String, enum: ['cash', 'card', 'upi', 'insurance'] },
  paymentDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);
