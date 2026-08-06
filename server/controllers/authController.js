const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, dateOfBirth, gender, bloodGroup } = req.body;

    const userExists = await User.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const user = await User.create({
      name, email, password, phone, dateOfBirth, gender, bloodGroup, role: 'patient'
    });

    const token = generateToken(user._id);

    res.status(201).json({ success: true, data: { token, user: { _id: user._id, name, email, role: user.role } }, message: 'Registered successfully' });
  } catch (error) {
    next(error);
  }
};

exports.registerDoctor = async (req, res, next) => {
  try {
    const { name, email, password, phone, specialization, qualification, experience, consultationFee, department } = req.body;

    const userExists = await User.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const user = await User.create({
      name, email, password, phone, specialization, qualification, experience, consultationFee, department, role: 'doctor', isApproved: false
    });

    const token = generateToken(user._id);

    res.status(201).json({ success: true, data: { token, user: { _id: user._id, name, email, role: user.role } }, message: 'Doctor registered successfully. Pending admin approval.' });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findByEmail(email).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.role === 'doctor' && !user.isApproved) {
       return res.status(403).json({ success: false, message: 'Account not approved yet' });
    }

    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    res.status(200).json({ success: true, data: { token, user }, message: 'Logged in successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user, message: 'User fetched successfully' });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    // Exclude password and role from being updated here
    const updateData = { ...req.body };
    delete updateData.password;
    delete updateData.role;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: user, message: 'Profile updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, data: {}, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};
