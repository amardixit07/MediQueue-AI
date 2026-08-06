import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle, Activity, ArrowRight, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const commonSymptoms = ['Fever', 'Cough', 'Headache', 'Nausea', 'Fatigue', 'Shortness of breath', 'Chest pain', 'Dizziness', 'Sore throat'];

const AISymptomChecker = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('1-3 days');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const toggleSymptom = (s) => {
    if (selectedSymptoms.includes(s)) {
      setSelectedSymptoms(selectedSymptoms.filter(i => i !== s));
    } else {
      setSelectedSymptoms([...selectedSymptoms, s]);
    }
  };

  const analyze = () => {
    if (selectedSymptoms.length === 0 && !description) {
      return toast.error('Please select or describe your symptoms');
    }
    setLoading(true);
    // Simulate AI API call
    setTimeout(() => {
      setLoading(false);
      setResult({
        urgency: selectedSymptoms.includes('Chest pain') || selectedSymptoms.includes('Shortness of breath') ? 'EMERGENCY' : 'ROUTINE',
        department: selectedSymptoms.includes('Chest pain') ? 'Cardiology' : 'General Medicine',
        conditions: ['Viral Infection', 'Common Cold'],
        advice: 'Based on your symptoms, a standard consultation is recommended to rule out any underlying infections. Please stay hydrated and rest.'
      });
    }, 2000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={24} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>AI Symptom Analyzer</h1>
          <p className="text-muted">Powered by Google Gemini</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <ShieldAlert color="var(--warning)" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: '0.875rem', color: 'var(--warning)', lineHeight: 1.5 }}>
          <strong>Disclaimer:</strong> This tool provides AI-generated preliminary analysis and is NOT a substitute for professional medical advice, diagnosis, or treatment. If you are experiencing a medical emergency, please visit the nearest hospital immediately.
        </p>
      </div>

      {!result ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>1. Select common symptoms</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
            {commonSymptoms.map(s => (
              <button
                key={s}
                onClick={() => toggleSymptom(s)}
                style={{
                  padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s',
                  background: selectedSymptoms.includes(s) ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${selectedSymptoms.includes(s) ? 'var(--primary)' : 'var(--border)'}`,
                  color: 'white'
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>2. Describe in detail</h3>
            <textarea 
              className="input" 
              rows="4" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="How are you feeling? Mention any other symptoms..." 
            />
          </div>

          <div className="input-group" style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>3. How long have you felt this way?</h3>
            <select className="input" value={duration} onChange={(e) => setDuration(e.target.value)}>
              <option value="Today">Today</option>
              <option value="1-3 days">1 to 3 days</option>
              <option value="1 week">About a week</option>
              <option value="More than a week">More than a week</option>
            </select>
          </div>

          <button 
            onClick={analyze} 
            disabled={loading} 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
          >
            {loading ? (
              <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Activity size={20}/></motion.div> Analyzing Symptoms...</>
            ) : (
              <><Sparkles size={20} /> Generate AI Analysis</>
            )}
          </button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className={`badge badge-${result.urgency === 'EMERGENCY' ? 'danger' : result.urgency === 'URGENT' ? 'warning' : 'success'}`} style={{ padding: '0.5rem 1rem', fontSize: '1rem', marginBottom: '1rem' }}>
              {result.urgency === 'EMERGENCY' && <AlertTriangle size={18} style={{ marginRight: '8px' }} />}
              {result.urgency} CARE SUGGESTED
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Recommended Dept: <span className="gradient-text">{result.department}</span></h2>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
            <h4 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-muted)' }}>Possible Conditions</h4>
            <ul style={{ listStylePosition: 'inside', lineHeight: 1.8 }}>
              {result.conditions.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>

          <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <h4 style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--primary)" /> AI Advice
            </h4>
            <p style={{ lineHeight: 1.6 }}>{result.advice}</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setResult(null)} className="btn btn-secondary" style={{ flex: 1 }}>Start Over</button>
            <button onClick={() => window.location.href = '/patient/book'} className="btn btn-primary" style={{ flex: 2 }}>
              Book Appointment <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AISymptomChecker;
