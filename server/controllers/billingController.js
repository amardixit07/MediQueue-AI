const Bill = require('../models/Bill');
const Appointment = require('../models/Appointment');

const generateBillNumber = async () => {
  const year = new Date().getFullYear();
  const count = await Bill.countDocuments();
  const seq = (count + 1).toString().padStart(3, '0');
  return `BILL-${year}-${seq}`;
};

exports.generateBill = async (req, res, next) => {
  try {
    const { patientId, appointmentId, doctorId, items, taxRate = 18, paymentMethod } = req.body;

    let subtotal = 0;
    items.forEach(item => {
      item.total = item.quantity * item.unitPrice;
      subtotal += item.total;
    });

    const taxAmount = (subtotal * taxRate) / 100;
    const grandTotal = subtotal + taxAmount;

    const billNumber = await generateBillNumber();

    const bill = await Bill.create({
      patient: patientId,
      appointment: appointmentId,
      doctor: doctorId,
      billNumber,
      items,
      subtotal,
      taxRate,
      taxAmount,
      grandTotal,
      paymentMethod,
      status: paymentMethod ? 'paid' : 'pending',
      paymentDate: paymentMethod ? new Date() : null
    });

    res.status(201).json({ success: true, data: bill, message: 'Bill generated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getMyBills = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'patient') {
      query.patient = req.user.id;
    } // admin sees all

    const bills = await Bill.find(query)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization')
      .populate('appointment', 'date')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bills, message: 'Bills fetched' });
  } catch (error) {
    next(error);
  }
};

exports.getBill = async (req, res, next) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('patient', 'name email address phone')
      .populate('doctor', 'name department')
      .populate('appointment', 'date timeSlot');

    if (!bill) return res.status(404).json({ success: false, message: 'Bill not found' });

    if (req.user.role === 'patient' && bill.patient._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: bill, message: 'Bill fetched' });
  } catch (error) {
    next(error);
  }
};

exports.payBill = async (req, res, next) => {
  try {
    const { paymentMethod } = req.body;
    const bill = await Bill.findById(req.params.id);

    if (!bill) return res.status(404).json({ success: false, message: 'Bill not found' });

    bill.status = 'paid';
    bill.paymentMethod = paymentMethod || 'cash';
    bill.paymentDate = new Date();

    await bill.save();

    // Mark appointment as paid if linked
    if (bill.appointment) {
      await Appointment.findByIdAndUpdate(bill.appointment, { isPaid: true });
    }

    res.status(200).json({ success: true, data: bill, message: 'Bill marked as paid' });
  } catch (error) {
    next(error);
  }
};

exports.cancelBill = async (req, res, next) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ success: false, message: 'Bill not found' });

    bill.status = 'cancelled';
    await bill.save();

    res.status(200).json({ success: true, data: bill, message: 'Bill cancelled' });
  } catch (error) {
    next(error);
  }
};
