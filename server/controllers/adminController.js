const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Bill = require('../models/Bill');

exports.getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    res.status(200).json({ success: true, data: doctors, message: 'Doctors fetched' });
  } catch (error) {
    next(error);
  }
};

exports.approveDoctor = async (req, res, next) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== 'doctor') return res.status(404).json({ success: false, message: 'Doctor not found' });

    doctor.isApproved = req.body.isApproved;
    await doctor.save();

    res.status(200).json({ success: true, data: doctor, message: 'Doctor approval status updated' });
  } catch (error) {
    next(error);
  }
};

exports.getAllPatients = async (req, res, next) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password');
    res.status(200).json({ success: true, data: patients, message: 'Patients fetched' });
  } catch (error) {
    next(error);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    
    const appointmentsToday = await Appointment.countDocuments({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    const billsToday = await Bill.find({
      paymentDate: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      },
      status: 'paid'
    });

    const revenueToday = billsToday.reduce((acc, bill) => acc + bill.grandTotal, 0);

    // Group by status
    const apptsByStatus = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const appointmentsByStatus = apptsByStatus.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.status(200).json({ success: true, data: { totalPatients, totalDoctors, appointmentsToday, revenueToday, appointmentsByStatus }, message: 'Stats fetched' });
  } catch (error) {
    next(error);
  }
};

exports.getDepartmentStats = async (req, res, next) => {
  try {
    const stats = await Appointment.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const formattedStats = stats.map(s => ({ department: s._id, count: s.count }));

    res.status(200).json({ success: true, data: formattedStats, message: 'Department stats fetched' });
  } catch (error) {
    next(error);
  }
};

exports.toggleUserStatus = async (req, res, next) => {
  try {
    // A placeholder for activating/deactivating users if needed
    res.status(200).json({ success: true, data: null, message: 'Status toggled' });
  } catch (error) {
    next(error);
  }
};
