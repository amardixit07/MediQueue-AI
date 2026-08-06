const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  tokens: [{
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tokenNumber: { type: Number, required: true },
    status: { type: String, enum: ['waiting', 'called', 'completed', 'skipped'], default: 'waiting' },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    calledAt: { type: Date },
    completedAt: { type: Date }
  }],
  currentToken: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Queue', queueSchema);
