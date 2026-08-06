import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, CheckCircle, Clock, DollarSign, ChevronRight, Activity } from 'lucide-react';
import StatCard from '../../components/StatCard';

const DoctorDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const mockQueue = [
    { token: 15, name: 'John Doe', status: 'Next', time: '10:30 AM' },
    { token: 16, name: 'Jane Smith', status: 'Waiting', time: '10:45 AM' },
    { token: 17, name: 'Robert Johnson', status: 'Waiting', time: '11:00 AM' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Good Morning, <span className="gradient-text">Dr. {user?.name?.split(' ')[0]}</span>!
          </h1>
          <p className="text-muted">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {user?.isApproved === false && (
        <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '2rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--warning)' }}>
          <Activity size={24} />
          <div>
            <h4 style={{ fontWeight: 600 }}>Profile Pending Approval</h4>
            <p style={{ fontSize: '0.875rem' }}>Your profile is currently under review by the administration. Some features may be restricted.</p>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <StatCard title="Today's Patients" value="24" icon={Users} color="var(--primary)" trend={12} />
        <StatCard title="Completed" value="14" icon={CheckCircle} color="var(--accent)" />
        <StatCard title="Pending" value="10" icon={Clock} color="var(--warning)" />
        <StatCard title="Revenue Today" value="$1,250" icon={DollarSign} color="var(--secondary)" trend={8} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Active Queue */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Live Queue Overview</h2>
            <button className="btn btn-secondary" onClick={() => navigate('/doctor/queue')} style={{ fontSize: '0.875rem' }}>Manage Queue</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            {mockQueue.map((item, index) => (
              <motion.div 
                key={item.token}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', 
                  background: item.status === 'Next' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)', 
                  borderRadius: '1rem', border: `1px solid ${item.status === 'Next' ? 'var(--primary)' : 'var(--border)'}` 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: item.status === 'Next' ? 'var(--primary)' : 'var(--text-muted)' }}>
                    #{item.token}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '1.1rem' }}>{item.name}</h4>
                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>Est. Time: {item.time}</p>
                  </div>
                </div>
                <div>
                  <span className={`badge ${item.status === 'Next' ? 'badge-info' : 'badge-warning'}`}>
                    {item.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          
          <button onClick={() => navigate('/doctor/queue')} className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%', padding: '1rem' }}>
            Open Queue Console <ChevronRight size={20} />
          </button>
        </div>

        {/* Quick Actions & Recent */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button onClick={() => navigate('/doctor/prescribe')} className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                📝 Write Prescription
              </button>
              <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                📅 View Schedule
              </button>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', flex: 1 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Prescriptions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[1, 2].map(i => (
                <div key={i} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: i===1 ? '1rem' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 500 }}>Patient #{10+i}</span>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>2h ago</span>
                  </div>
                  <p className="text-muted" style={{ fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Rx: Amoxicillin, Paracetamol...
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
