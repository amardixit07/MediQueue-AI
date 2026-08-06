import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Activity, BellRing } from 'lucide-react';

const QueueTracker = () => {
  // Mock data for UI demonstration
  const [myToken, setMyToken] = useState(12);
  const [currentServing, setCurrentServing] = useState(10);
  const [status, setStatus] = useState('waiting'); // waiting, called, completed
  
  const peopleAhead = myToken - currentServing - 1;
  const estimatedWait = (peopleAhead + 1) * 10; // 10 mins per person

  useEffect(() => {
    // Simulate real-time updates
    const timer = setInterval(() => {
      setCurrentServing(prev => {
        if (prev < myToken) {
          if (prev + 1 === myToken) setStatus('called');
          return prev + 1;
        }
        return prev;
      });
    }, 10000); // Update every 10s for demo
    
    return () => clearInterval(timer);
  }, [myToken]);

  const tokens = Array.from({ length: 7 }, (_, i) => currentServing - 1 + i).filter(t => t > 0);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Live Queue Tracker</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* Main Display */}
        <motion.div 
          className="glass-card" 
          style={{ 
            padding: '3rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden',
            border: status === 'called' ? '2px solid var(--accent)' : '1px solid var(--border)'
          }}
          animate={status === 'called' ? { boxShadow: ['0 0 0px var(--accent)', '0 0 20px var(--accent)', '0 0 0px var(--accent)'] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {status === 'called' && (
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <BellRing className="animate-pulse-ring" /> It's your turn!
            </div>
          )}
          
          <p className="text-muted" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Your Token Number</p>
          <h2 className={status === 'called' ? 'gradient-text' : ''} style={{ fontSize: '6rem', fontWeight: 800, lineHeight: 1, marginBottom: '2rem' }}>
            #{myToken}
          </h2>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
            <div>
              <p className="text-muted" style={{ marginBottom: '0.5rem' }}>Currently Serving</p>
              <p style={{ fontSize: '2rem', fontWeight: 700 }}>#{currentServing}</p>
            </div>
            <div>
              <p className="text-muted" style={{ marginBottom: '0.5rem' }}>People Ahead</p>
              <p style={{ fontSize: '2rem', fontWeight: 700 }}>{Math.max(0, peopleAhead)}</p>
            </div>
            <div>
              <p className="text-muted" style={{ marginBottom: '0.5rem' }}>Est. Wait Time</p>
              <p style={{ fontSize: '2rem', fontWeight: 700 }}>{Math.max(0, estimatedWait)} min</p>
            </div>
          </div>
        </motion.div>

        {/* Visual Queue */}
        <div className="glass-card" style={{ padding: '2rem', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Queue Timeline</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 'max-content', padding: '1rem 0' }}>
            {tokens.map(token => (
              <React.Fragment key={token}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '1.25rem', transition: 'all 0.3s',
                  background: token === myToken ? 'var(--primary)' : token === currentServing ? 'var(--accent)' : token < currentServing ? 'rgba(255,255,255,0.05)' : 'rgba(30,41,59,0.8)',
                  color: token < currentServing ? 'var(--text-muted)' : 'white',
                  border: token === myToken ? 'none' : `2px solid ${token === currentServing ? 'var(--accent)' : 'var(--border)'}`,
                  opacity: token < currentServing ? 0.5 : 1
                }}>
                  {token}
                </div>
                {token !== tokens[tokens.length - 1] && (
                  <div style={{ width: '40px', height: '2px', background: 'var(--border)' }} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem', fontSize: '0.875rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent)' }}></div> Serving</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }}></div> Your Token</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid var(--border)' }}></div> Waiting</span>
          </div>
        </div>

        {/* Doctor Info */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
            DR
          </div>
          <div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Dr. Sarah Wilson</h4>
            <p className="text-muted">Cardiology Department • Room 204</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueTracker;
