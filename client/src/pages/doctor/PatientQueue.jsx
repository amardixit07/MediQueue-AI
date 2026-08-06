import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, SkipForward, CheckSquare, Clock, User, X } from 'lucide-react';
import toast from 'react-hot-toast';

const mockQueueData = [
  { id: 1, token: 15, name: 'John Doe', age: 34, gender: 'Male', status: 'serving', time: '10:30 AM', symptoms: 'Fever for 2 days, mild cough.' },
  { id: 2, token: 16, name: 'Jane Smith', age: 28, gender: 'Female', status: 'waiting', time: '10:45 AM', symptoms: 'Severe headache, nausea.' },
  { id: 3, token: 17, name: 'Robert Johnson', age: 45, gender: 'Male', status: 'waiting', time: '11:00 AM', symptoms: 'Routine checkup.' },
  { id: 4, token: 18, name: 'Emily Davis', age: 22, gender: 'Female', status: 'waiting', time: '11:15 AM', symptoms: 'Stomach pain after meals.' },
];

const PatientQueue = () => {
  const [isActive, setIsActive] = useState(true);
  const [queue, setQueue] = useState(mockQueueData);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const currentServing = queue.find(q => q.status === 'serving');
  const nextPatient = queue.find(q => q.status === 'waiting');

  const handleCallNext = () => {
    if (!nextPatient) return toast.info('No more patients in queue');
    
    // Play sound notification
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.log('Audio play failed'));
    
    setQueue(queue.map(q => {
      if (q.status === 'serving') return { ...q, status: 'completed' };
      if (q.id === nextPatient.id) return { ...q, status: 'serving' };
      return q;
    }));
    toast.success(`Called Token #${nextPatient.token}`);
  };

  const handleComplete = (id) => {
    setQueue(queue.map(q => q.id === id ? { ...q, status: 'completed' } : q));
    toast.success('Consultation marked as completed');
  };

  const handleSkip = (id) => {
    setQueue(queue.map(q => q.id === id ? { ...q, status: 'skipped' } : q));
    toast.error(`Token skipped`);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '2rem', height: 'calc(100vh - 6rem)' }}>
      
      {/* Left Area - Main Control */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Queue Console</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: 600, color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}>
              {isActive ? '● Accepting Patients' : '○ Queue Paused'}
            </span>
            <button 
              onClick={() => setIsActive(!isActive)}
              className={`btn ${isActive ? 'btn-danger' : 'btn-primary'}`}
            >
              {isActive ? 'Pause Queue' : 'Start Queue'}
            </button>
          </div>
        </div>

        {/* Current Serving Big Display */}
        <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          {currentServing ? (
            <>
              <p className="text-muted" style={{ fontSize: '1.25rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Currently Serving</p>
              <h2 className="gradient-text" style={{ fontSize: '6rem', fontWeight: 800, lineHeight: 1, marginBottom: '1rem' }}>
                #{currentServing.token}
              </h2>
              <p style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem' }}>{currentServing.name}</p>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={() => handleComplete(currentServing.id)} className="btn btn-secondary" style={{ padding: '1rem 2rem', borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                  <CheckSquare size={20} /> Complete
                </button>
                <button onClick={() => handleSkip(currentServing.id)} className="btn btn-secondary" style={{ padding: '1rem 2rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                  <SkipForward size={20} /> Skip
                </button>
              </div>
            </>
          ) : (
            <div style={{ padding: '4rem 0', color: 'var(--text-muted)' }}>
              <Clock size={64} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
              <h2 style={{ fontSize: '2rem', fontWeight: 600 }}>Queue is Empty</h2>
            </div>
          )}
        </div>

        <button 
          onClick={handleCallNext} 
          disabled={!isActive || !nextPatient}
          className="btn btn-primary" 
          style={{ padding: '1.5rem', fontSize: '1.25rem', fontWeight: 600, display: 'flex', justifyContent: 'center', gap: '1rem', width: '100%' }}
        >
          <Volume2 size={24} /> 
          {nextPatient ? `Call Next (Token #${nextPatient.token})` : 'No Patients Waiting'}
        </button>
      </div>

      {/* Right Area - Queue List & Details */}
      <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Patient Details Panel (Slide in) */}
        <AnimatePresence>
          {selectedPatient && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="glass-card" 
              style={{ padding: '1.5rem', border: '1px solid var(--primary)', position: 'relative' }}
            >
              <button onClick={() => setSelectedPatient(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={24} color="white" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{selectedPatient.name}</h3>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>Token #{selectedPatient.token} • {selectedPatient.age} yrs • {selectedPatient.gender}</p>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Reported Symptoms:</h4>
                <p style={{ lineHeight: 1.5 }}>{selectedPatient.symptoms}</p>
              </div>
              <button onClick={() => window.location.href='/doctor/prescribe'} className="btn btn-secondary" style={{ width: '100%' }}>Write Prescription</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Queue List */}
        <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Waiting List</h2>
            <span className="badge badge-info">{queue.filter(q => q.status === 'waiting').length} waiting</span>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {queue.map(q => (
                <div 
                  key={q.id}
                  onClick={() => setSelectedPatient(q)}
                  style={{
                    padding: '1rem', borderRadius: '0.5rem', cursor: 'pointer', transition: 'all 0.2s',
                    background: q.status === 'serving' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${q.status === 'serving' ? 'var(--primary)' : 'transparent'}`,
                    opacity: q.status === 'completed' || q.status === 'skipped' ? 0.5 : 1
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '1.25rem', color: q.status === 'serving' ? 'var(--primary)' : 'var(--text-muted)', width: '40px' }}>#{q.token}</span>
                      <div>
                        <h4 style={{ fontWeight: 500 }}>{q.name}</h4>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>{q.time}</span>
                      </div>
                    </div>
                    {q.status === 'serving' && <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>SERVING</span>}
                    {q.status === 'completed' && <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>DONE</span>}
                    {q.status === 'skipped' && <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>SKIP</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientQueue;
