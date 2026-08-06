import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, Trash2, Save, Printer, User } from 'lucide-react';
import toast from 'react-hot-toast';

const WritePrescription = () => {
  const [patientId, setPatientId] = useState('');
  const [vitals, setVitals] = useState({ bp: '', pulse: '', temp: '', weight: '' });
  const [complaint, setComplaint] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: 'OD', duration: '', instructions: '' }]);
  const [labTests, setLabTests] = useState('');
  const [notes, setNotes] = useState('');
  
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addMedicineRow = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: 'OD', duration: '', instructions: '' }]);
  };

  const removeMedicineRow = (index) => {
    const newMeds = [...medicines];
    newMeds.splice(index, 1);
    setMedicines(newMeds);
  };

  const updateMedicine = (index, field, value) => {
    const newMeds = [...medicines];
    newMeds[index][field] = value;
    setMedicines(newMeds);
  };

  const getAISuggestions = () => {
    if (!complaint || !diagnosis) return toast.error('Enter chief complaint and diagnosis first');
    
    setIsAnalyzing(true);
    setShowAIPanel(true);
    
    // Simulate AI API Call
    setTimeout(() => {
      setIsAnalyzing(false);
      setAiSuggestions({
        medicines: [
          { name: 'Paracetamol', dosage: '500mg', frequency: 'SOS', duration: '3 days', instructions: 'After meals if fever > 100F' },
          { name: 'Amoxicillin', dosage: '500mg', frequency: 'TDS', duration: '5 days', instructions: 'Complete the course' }
        ],
        tests: 'CBC, CRP',
        advice: 'Rest for 2 days, maintain hydration.'
      });
    }, 1500);
  };

  const applyAISuggestions = () => {
    if (aiSuggestions) {
      setMedicines([...medicines.filter(m => m.name !== ''), ...aiSuggestions.medicines]);
      setLabTests(prev => prev ? `${prev}, ${aiSuggestions.tests}` : aiSuggestions.tests);
      toast.success('AI suggestions applied');
      setShowAIPanel(false);
    }
  };

  const handleSave = () => {
    toast.success('Prescription saved successfully');
    // Implement print or save logic
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '2rem' }}>
      
      {/* Main Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Write Prescription</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary"><Printer size={18} /> Print</button>
            <button onClick={handleSave} className="btn btn-primary"><Save size={18} /> Save EMR</button>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          
          {/* Patient Selection & Vitals */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
            <div>
              <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Select Patient (from queue)</label>
              <select className="input" value={patientId} onChange={(e) => setPatientId(e.target.value)}>
                <option value="">-- Select Patient --</option>
                <option value="1">John Doe - #15</option>
                <option value="2">Jane Smith - #16</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              <div><label className="input-label">BP (mmHg)</label><input type="text" className="input" placeholder="120/80" value={vitals.bp} onChange={e => setVitals({...vitals, bp: e.target.value})} /></div>
              <div><label className="input-label">Pulse (bpm)</label><input type="text" className="input" placeholder="72" value={vitals.pulse} onChange={e => setVitals({...vitals, pulse: e.target.value})} /></div>
              <div><label className="input-label">Temp (°F)</label><input type="text" className="input" placeholder="98.6" value={vitals.temp} onChange={e => setVitals({...vitals, temp: e.target.value})} /></div>
              <div><label className="input-label">Weight (kg)</label><input type="text" className="input" placeholder="70" value={vitals.weight} onChange={e => setVitals({...vitals, weight: e.target.value})} /></div>
            </div>
          </div>

          {/* Clinical Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div className="input-group">
              <label className="input-label">Chief Complaint</label>
              <textarea className="input" rows="3" value={complaint} onChange={e => setComplaint(e.target.value)} placeholder="Patient's symptoms..." />
            </div>
            <div className="input-group">
              <label className="input-label">Diagnosis</label>
              <textarea className="input" rows="3" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} placeholder="Provisional or final diagnosis..." />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <button onClick={getAISuggestions} className="btn" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', padding: '0.75rem 2rem', borderRadius: '999px', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
              <Sparkles size={18} /> Get AI Rx Suggestions
            </button>
          </div>

          {/* Medicines */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Rx Medicines</h3>
              <button onClick={addMedicineRow} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}><Plus size={16} /> Add Medicine</button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ minWidth: '800px' }}>
                <thead>
                  <tr>
                    <th>Medicine Name</th>
                    <th style={{ width: '120px' }}>Dosage</th>
                    <th style={{ width: '120px' }}>Frequency</th>
                    <th style={{ width: '120px' }}>Duration</th>
                    <th>Instructions</th>
                    <th style={{ width: '60px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((med, idx) => (
                    <tr key={idx}>
                      <td><input type="text" className="input" placeholder="e.g. Paracetamol" value={med.name} onChange={e => updateMedicine(idx, 'name', e.target.value)} /></td>
                      <td><input type="text" className="input" placeholder="500mg" value={med.dosage} onChange={e => updateMedicine(idx, 'dosage', e.target.value)} /></td>
                      <td>
                        <select className="input" value={med.frequency} onChange={e => updateMedicine(idx, 'frequency', e.target.value)}>
                          <option value="OD">OD (Once)</option>
                          <option value="BD">BD (Twice)</option>
                          <option value="TDS">TDS (Thrice)</option>
                          <option value="QID">QID (Four)</option>
                          <option value="SOS">SOS (As needed)</option>
                        </select>
                      </td>
                      <td><input type="text" className="input" placeholder="5 days" value={med.duration} onChange={e => updateMedicine(idx, 'duration', e.target.value)} /></td>
                      <td><input type="text" className="input" placeholder="After food" value={med.instructions} onChange={e => updateMedicine(idx, 'instructions', e.target.value)} /></td>
                      <td style={{ textAlign: 'center' }}>
                        <button onClick={() => removeMedicineRow(idx)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="input-group">
              <label className="input-label">Lab Tests Requested</label>
              <textarea className="input" rows="2" value={labTests} onChange={e => setLabTests(e.target.value)} placeholder="e.g. CBC, X-Ray Chest" />
            </div>
            <div className="input-group">
              <label className="input-label">Doctor Notes / Advice</label>
              <textarea className="input" rows="2" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Dietary restrictions, rest advice..." />
            </div>
          </div>

        </div>
      </div>

      {/* AI Assistant Sidebar */}
      <AnimatePresence>
        {showAIPanel && (
          <motion.div 
            initial={{ opacity: 0, x: 50, width: 0 }} 
            animate={{ opacity: 1, x: 0, width: '350px' }} 
            exit={{ opacity: 0, x: 50, width: 0 }}
            className="glass-card" 
            style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(99,102,241,0.3)', background: 'rgba(15,23,42,0.95)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary)' }}>
                <Sparkles size={20} /> AI Assistant
              </h3>
              <button onClick={() => setShowAIPanel(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>X</button>
            </div>

            {isAnalyzing ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ marginBottom: '1rem' }}><Activity size={32} color="var(--primary)"/></motion.div>
                <p>Analyzing clinical data...</p>
              </div>
            ) : aiSuggestions && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, overflowY: 'auto' }}>
                <div>
                  <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Suggested Medicines</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {aiSuggestions.medicines.map((med, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
                        <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'white' }}>{med.name} {med.dosage}</strong>
                        <span style={{ color: 'var(--text-muted)' }}>{med.frequency} • {med.duration} • {med.instructions}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Recommended Tests</h4>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
                    {aiSuggestions.tests}
                  </div>
                </div>
                
                <div>
                  <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>General Advice</h4>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
                    {aiSuggestions.advice}
                  </div>
                </div>

                <button onClick={applyAISuggestions} className="btn btn-primary" style={{ marginTop: 'auto', padding: '1rem' }}>
                  Apply to Prescription
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default WritePrescription;
