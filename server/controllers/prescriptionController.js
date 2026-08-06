const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');

exports.createPrescription = async (req, res, next) => {
  try {
    const { appointmentId, patientId, diagnosis, chiefComplaint, medicines, labTests, notes, followUpDate, vitalSigns } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    if (appointment.doctor.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });

    const prescription = await Prescription.create({
      patient: patientId,
      doctor: req.user.id,
      appointment: appointmentId,
      diagnosis,
      chiefComplaint,
      medicines,
      labTests,
      notes,
      followUpDate,
      vitalSigns
    });

    res.status(201).json({ success: true, data: prescription, message: 'Prescription created successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getMyPrescriptions = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'patient') {
      query.patient = req.user.id;
    } else if (req.user.role === 'doctor') {
      query.doctor = req.user.id;
    }

    const prescriptions = await Prescription.find(query)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization')
      .populate('appointment', 'date department')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: prescriptions, message: 'Prescriptions fetched' });
  } catch (error) {
    next(error);
  }
};

exports.getPrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'name email phone bloodGroup dateOfBirth')
      .populate('doctor', 'name specialization qualification')
      .populate('appointment', 'date');

    if (!prescription) return res.status(404).json({ success: false, message: 'Prescription not found' });

    if (req.user.role === 'patient' && prescription.patient._id.toString() !== req.user.id) {
       return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: prescription, message: 'Prescription fetched' });
  } catch (error) {
    next(error);
  }
};

exports.getPrescriptionByAppointment = async (req, res, next) => {
  try {
    const prescription = await Prescription.findOne({ appointment: req.params.appointmentId })
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization');

    if (!prescription) return res.status(404).json({ success: false, message: 'No prescription found for this appointment' });

    res.status(200).json({ success: true, data: prescription, message: 'Prescription fetched' });
  } catch (error) {
    next(error);
  }
};
