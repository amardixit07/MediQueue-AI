const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  diagnosis: { type: String, required: true },
  chiefComplaint: { type: String },
  medicines: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    instructions: { type: String }
  }],
  labTests: [{
    name: { type: String },
    instructions: { type: String }
  }],
  notes: { type: String },
  followUpDate: { type: Date },
  vitalSigns: {
    bp: String,
    pulse: Number,
    temperature: Number,
    weight: Number,
    height: Number,
    spo2: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
