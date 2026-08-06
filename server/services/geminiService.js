const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize inside functions or exported module to ensure env is loaded
const getAI = () => new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeSymptoms = async (symptoms, description) => {
  try {
    const genAI = getAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    You are an AI medical assistant for a hospital queue management system.
    A patient has reported the following symptoms: ${symptoms.join(', ')}.
    Additional description: ${description || 'None'}.
    
    Based on this, provide a JSON response with the following strictly defined structure:
    {
      "urgencyLevel": "routine" | "urgent" | "emergency",
      "recommendedDepartment": "One of: General, Cardiology, Neurology, Orthopedics, Pediatrics, Dermatology, ENT, Ophthalmology, Gynecology, Psychiatry",
      "possibleConditions": ["Condition 1", "Condition 2"],
      "advice": "General advice for the patient while they wait",
      "disclaimer": "A standard medical disclaimer"
    }
    Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error('Failed to analyze symptoms');
  }
};

exports.getPrescriptionSuggestions = async (diagnosis, symptoms) => {
  try {
    const genAI = getAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    You are an AI assistant for doctors. The doctor has diagnosed a patient with: ${diagnosis}.
    The patient's symptoms were: ${symptoms ? symptoms.join(', ') : 'Not provided'}.
    
    Suggest a potential prescription plan in JSON format. The response must match this structure exactly:
    {
      "suggestedMedicines": [
        {
          "name": "Medicine Name",
          "dosage": "e.g., 500mg",
          "frequency": "e.g., 1-0-1 (Twice a day)",
          "duration": "e.g., 5 days",
          "instructions": "e.g., After meals"
        }
      ],
      "precautions": ["Precaution 1", "Precaution 2"],
      "followUpRecommendation": "e.g., 1 week"
    }
    Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error('Failed to generate prescription suggestions');
  }
};

exports.chatWithAI = async (message, conversationHistory = []) => {
  try {
    const genAI = getAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let chatHistory = "You are a helpful assistant for MediQueue AI, a hospital management system. Keep responses concise.\n";
    
    if (conversationHistory.length > 0) {
      chatHistory += "Previous conversation:\n";
      conversationHistory.forEach(msg => {
        chatHistory += `${msg.role}: ${msg.text}\n`;
      });
    }
    
    chatHistory += `User: ${message}\nAssistant:`;

    const result = await model.generateContent(chatHistory);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error('Failed to communicate with AI');
  }
};
