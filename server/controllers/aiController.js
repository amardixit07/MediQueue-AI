const geminiService = require('../services/geminiService');

exports.symptomCheck = async (req, res, next) => {
  try {
    const { symptoms, description } = req.body;
    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ success: false, message: 'Symptoms are required' });
    }

    const analysis = await geminiService.analyzeSymptoms(symptoms, description);
    res.status(200).json({ success: true, data: analysis, message: 'Symptom analysis complete' });
  } catch (error) {
    next(error);
  }
};

exports.prescriptionAssist = async (req, res, next) => {
  try {
    const { diagnosis, symptoms } = req.body;
    if (!diagnosis) {
      return res.status(400).json({ success: false, message: 'Diagnosis is required' });
    }

    const suggestions = await geminiService.getPrescriptionSuggestions(diagnosis, symptoms);
    res.status(200).json({ success: true, data: suggestions, message: 'Prescription suggestions generated' });
  } catch (error) {
    next(error);
  }
};

exports.chat = async (req, res, next) => {
  try {
    const { message, conversationHistory } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const response = await geminiService.chatWithAI(message, conversationHistory);
    res.status(200).json({ success: true, data: { response }, message: 'Chat response generated' });
  } catch (error) {
    next(error);
  }
};

exports.getDepartments = async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: ['General', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'ENT', 'Ophthalmology', 'Gynecology', 'Psychiatry']
  });
};
