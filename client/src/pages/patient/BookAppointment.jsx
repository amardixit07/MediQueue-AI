import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, Calendar as CalendarIcon, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const departments = [
  { name: 'General', icon: '👨‍⚕️' },
  { name: 'Cardiology', icon: '🫀' },
  { name: 'Neurology', icon: '🧠' },
  { name: 'Orthopedics', icon: '🦴' },
  { name: 'Pediatrics', icon: '👶' },
  { name: 'Dermatology', icon: ' छाला ' },
];

const mockDoctors = [
  { id: 1, name: 'Dr. Sarah Wilson', dept: 'Cardiology', exp: '15 Yrs', rating: 4.9, fee: 150, nextAvailable: 'Today' },
  { id: 2, name: 'Dr. James Smith', dept: 'General', exp: '8 Yrs', rating: 4.7, fee: 80, nextAvailable: 'Tomorrow' },
];

const mockSlots = ['09:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '03:30 PM', '04:00 PM'];

const BookAppointment = () => {
  const [step, setStep] = useState(1);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [symptoms, setSymptoms] = useState('');

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleBook = () => {
    toast.success('Appointment booked successfully!');
    setTimeout(() => { window.location.href = '/patient/dashboard'; }, 1500);
  };

  const renderStep1 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Select Department</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
        {departments.map((dept) => (
          <div 
            key={dept.name}
            onClick={() => { setSelectedDept(dept.name); nextStep(); }}
            className="glass-card"
            style={{ 
              padding: '2rem 1rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
              border: selectedDept === dept.name ? '2px solid var(--primary)' : '1px solid var(--border)'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{dept.icon}</div>
            <h3 style={{ fontWeight: 500 }}>{dept.name}</h3>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Select Doctor ({selectedDept})</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {mockDoctors.filter(d => d.dept === selectedDept || !selectedDept).map((doc) => (
          <div key={doc.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {doc.name.charAt(4)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{doc.name}</h3>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>{doc.dept} • {doc.exp} exp</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem', color: 'var(--warning)', fontSize: '0.875rem' }}>
                  <Star size={14} fill="currentColor" /> {doc.rating}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <div>
                <p className="text-muted" style={{ fontSize: '0.75rem' }}>Consultation Fee</p>
                <p style={{ fontWeight: 600 }}>${doc.fee}</p>
              </div>
              <button onClick={() => { setSelectedDoctor(doc); nextStep(); }} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Select</button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Select Date & Time</h2>
      <div className="glass-card" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <div className="input-group" style={{ marginBottom: '2rem' }}>
          <label className="input-label">Select Date</label>
          <input type="date" className="input" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
        </div>
        
        {selectedDate && (
          <div>
            <label className="input-label" style={{ marginBottom: '1rem', display: 'block' }}>Available Slots</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {mockSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  style={{
                    padding: '0.75rem', borderRadius: '0.5rem', background: selectedSlot === slot ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${selectedSlot === slot ? 'var(--primary)' : 'var(--border)'}`, color: 'white', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
            <button onClick={nextStep} disabled={!selectedSlot} className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }}>Continue</button>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Confirm Booking</h2>
      <div className="glass-card" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Appointment Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Doctor:</span> <span>{selectedDoctor?.name}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Department:</span> <span>{selectedDept}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Date:</span> <span>{selectedDate}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Time:</span> <span>{selectedSlot}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Fee:</span> <span>${selectedDoctor?.fee}</span></div>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Briefly describe your symptoms (Optional)</label>
          <textarea className="input" rows="3" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="E.g., fever for 2 days, mild headache..." />
        </div>

        <button onClick={handleBook} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', fontSize: '1.1rem', padding: '1rem' }}>
          <CheckCircle size={20} /> Confirm & Book
        </button>
      </div>
    </motion.div>
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Book Appointment</h1>
        {step > 1 && <button onClick={prevStep} className="btn btn-secondary">Back</button>}
      </div>

      {/* Progress Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ flex: 1, height: '4px', background: i <= step ? 'var(--primary)' : 'var(--border)', borderRadius: '2px', transition: 'all 0.3s' }} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </AnimatePresence>
    </div>
  );
};

export default BookAppointment;
