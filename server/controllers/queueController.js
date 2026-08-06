const Queue = require('../models/Queue');

exports.getDoctorQueue = async (req, res, next) => {
  try {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    const queue = await Queue.findOne({ doctor: req.params.doctorId, date })
      .populate('tokens.patient', 'name email phone')
      .populate('tokens.appointment', 'timeSlot urgencyLevel');

    if (!queue) {
      return res.status(200).json({ success: true, data: null, message: 'No queue found for today' });
    }

    res.status(200).json({ success: true, data: queue, message: 'Queue fetched successfully' });
  } catch (error) {
    next(error);
  }
};

exports.callNextPatient = async (req, res, next) => {
  try {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    const queue = await Queue.findOne({ doctor: req.user.id, date });
    if (!queue) return res.status(404).json({ success: false, message: 'Queue not found' });

    const tokenIndex = queue.tokens.findIndex(t => t._id.toString() === req.params.tokenId);
    if (tokenIndex === -1) return res.status(404).json({ success: false, message: 'Token not found' });

    queue.tokens[tokenIndex].status = 'called';
    queue.tokens[tokenIndex].calledAt = new Date();
    queue.currentToken = queue.tokens[tokenIndex].tokenNumber;

    await queue.save();

    // Emit socket event
    if (req.io) {
      req.io.to(`queue-${req.user.id}`).emit('queue-updated', queue);
      req.io.to(`patient-${queue.tokens[tokenIndex].patient}`).emit('token-called', { queueId: queue._id, token: queue.tokens[tokenIndex] });
    }

    res.status(200).json({ success: true, data: queue, message: 'Patient called' });
  } catch (error) {
    next(error);
  }
};

exports.completeConsultation = async (req, res, next) => {
  try {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    const queue = await Queue.findOne({ doctor: req.user.id, date });
    if (!queue) return res.status(404).json({ success: false, message: 'Queue not found' });

    const tokenIndex = queue.tokens.findIndex(t => t._id.toString() === req.params.tokenId);
    if (tokenIndex === -1) return res.status(404).json({ success: false, message: 'Token not found' });

    queue.tokens[tokenIndex].status = 'completed';
    queue.tokens[tokenIndex].completedAt = new Date();

    await queue.save();

    if (req.io) {
      req.io.to(`queue-${req.user.id}`).emit('queue-updated', queue);
      req.io.to(`patient-${queue.tokens[tokenIndex].patient}`).emit('consultation-complete', { queueId: queue._id, token: queue.tokens[tokenIndex] });
    }

    res.status(200).json({ success: true, data: queue, message: 'Consultation marked complete' });
  } catch (error) {
    next(error);
  }
};

exports.skipToken = async (req, res, next) => {
  try {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    const queue = await Queue.findOne({ doctor: req.user.id, date });
    if (!queue) return res.status(404).json({ success: false, message: 'Queue not found' });

    const tokenIndex = queue.tokens.findIndex(t => t._id.toString() === req.params.tokenId);
    if (tokenIndex === -1) return res.status(404).json({ success: false, message: 'Token not found' });

    queue.tokens[tokenIndex].status = 'skipped';

    await queue.save();

    if (req.io) {
      req.io.to(`queue-${req.user.id}`).emit('queue-updated', queue);
    }

    res.status(200).json({ success: true, data: queue, message: 'Token skipped' });
  } catch (error) {
    next(error);
  }
};

exports.getPatientPosition = async (req, res, next) => {
  try {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    // Find queues where patient is waiting today
    const queues = await Queue.find({ 
      date, 
      'tokens.patient': req.user.id,
      'tokens.status': 'waiting'
    }).populate('doctor', 'name department');

    const positions = queues.map(q => {
      const myToken = q.tokens.find(t => t.patient.toString() === req.user.id && t.status === 'waiting');
      if (!myToken) return null;
      
      let waitingBeforeMe = 0;
      for (let t of q.tokens) {
        if (t.status === 'waiting' && t.tokenNumber < myToken.tokenNumber) {
          waitingBeforeMe++;
        }
      }

      return {
        doctor: q.doctor,
        myTokenNumber: myToken.tokenNumber,
        currentToken: q.currentToken,
        waitingBeforeMe
      };
    }).filter(p => p !== null);

    res.status(200).json({ success: true, data: positions, message: 'Positions fetched' });
  } catch (error) {
    next(error);
  }
};
