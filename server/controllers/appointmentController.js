const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Queue = require('../models/Queue');
const mongoose = require('mongoose');

exports.bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, timeSlot, department, symptoms, notes, urgencyLevel } = req.body;

    // Verify doctor
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Check if slot is taken
    const existing = await Appointment.findOne({ doctor: doctorId, date: new Date(date), timeSlot, status: { $ne: 'cancelled' } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Time slot already booked' });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      department,
      symptoms,
      notes,
      urgencyLevel
    });

    res.status(201).json({ success: true, data: appointment, message: 'Appointment booked successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getMyAppointments = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'patient') {
      query.patient = req.user.id;
    } else if (req.user.role === 'doctor') {
      query.doctor = req.user.id;
    } // admin sees all

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone bloodGroup')
      .populate('doctor', 'name specialization department')
      .sort({ date: 1, timeSlot: 1 });

    res.status(200).json({ success: true, data: appointments, message: 'Appointments fetched successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone dateOfBirth gender bloodGroup allergies emergencyContact')
      .populate('doctor', 'name specialization department consultationFee');
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Check access
    if (req.user.role === 'patient' && appointment.patient._id.toString() !== req.user.id) {
       return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (req.user.role === 'doctor' && appointment.doctor._id.toString() !== req.user.id) {
       return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: appointment, message: 'Appointment fetched successfully' });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id).session(session);

    if (!appointment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = status;
    
    if (status === 'confirmed') {
      // Add to Queue
      const queueDate = new Date(appointment.date);
      queueDate.setHours(0, 0, 0, 0);

      let queue = await Queue.findOne({ doctor: appointment.doctor, date: queueDate }).session(session);
      
      if (!queue) {
        queue = new Queue({ doctor: appointment.doctor, date: queueDate, tokens: [] });
      }

      const tokenNumber = queue.tokens.length + 1;
      appointment.tokenNumber = tokenNumber;

      queue.tokens.push({
        patient: appointment.patient,
        tokenNumber,
        status: 'waiting',
        appointment: appointment._id
      });

      await queue.save({ session });
    }

    await appointment.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, data: appointment, message: `Appointment ${status}` });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

exports.cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.patient.toString() !== req.user.id) {
       return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({ success: true, data: appointment, message: 'Appointment cancelled' });
  } catch (error) {
    next(error);
  }
};

exports.getDoctorSlots = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query; // YYYY-MM-DD

    if (!date) {
      return res.status(400).json({ success: false, message: 'Please provide a date' });
    }

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const queryDate = new Date(date);
    
    const existingAppointments = await Appointment.find({
      doctor: doctorId,
      date: {
        $gte: new Date(queryDate.setHours(0, 0, 0, 0)),
        $lt: new Date(queryDate.setHours(23, 59, 59, 999))
      },
      status: { $ne: 'cancelled' }
    });

    const bookedSlots = existingAppointments.map(app => app.timeSlot);

    // Generate slots (9 AM to 5 PM, 30 min intervals)
    const allSlots = [];
    let startHour = 9;
    let startMin = 0;

    for (let i = 0; i < 16; i++) {
      const hStr = startHour.toString().padStart(2, '0');
      const mStr = startMin.toString().padStart(2, '0');
      const slot = `${hStr}:${mStr}`;
      
      let endMin = startMin + 30;
      let endHour = startHour;
      if (endMin >= 60) {
        endMin = 0;
        endHour++;
      }
      const eStr = endHour.toString().padStart(2, '0');
      const emStr = endMin.toString().padStart(2, '0');
      const fullSlot = `${slot} - ${eStr}:${emStr}`;

      if (!bookedSlots.includes(fullSlot)) {
        allSlots.push(fullSlot);
      }

      startMin += 30;
      if (startMin >= 60) {
        startMin = 0;
        startHour++;
      }
    }

    res.status(200).json({ success: true, data: allSlots, message: 'Available slots fetched' });
  } catch (error) {
    next(error);
  }
};
