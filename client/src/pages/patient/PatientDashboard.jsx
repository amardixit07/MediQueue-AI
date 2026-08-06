import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Activity, FileText, ChevronRight, Bell } from 'lucide-react';
import StatCard from '../../components/StatCard';

const PatientDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const upcomingAppointments = [
    { id: 1, doctor: 'Dr. Sarah Wilson', dept: 'Cardiology', date: 'Oct 25, 2026', time: '10:00 AM', status: 'Upcoming' },
    { id: 2, doctor: 'Dr. James Smith', dept: 'General', date: 'Oct 28, 2026', time: '02:30 PM', status: 'Pending' }
  ];

  const quickActions = [
    { title: 'Book Appointment', desc: 'Schedule a new visit', icon: Calendar, color: 'var(--primary)', path: '/patient/book' },
    { title: 'Check Queue', desc: 'Track your live token', icon: Clock, color: 'var(--warning)', path: '/patient/queue' },
    { title: 'Symptom Checker', desc: 'AI triage assistant', icon: Activity, color: 'var(--accent)', path: '/patient/symptom-checker' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            {getGreeting()}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>!
          </h1>
          <p className="text-muted">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <button className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
          <Bell size={20} />
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <StatCard title="Upcoming Visits" value="2" icon={Calendar} color="var(--primary)" />
        <StatCard title="Pending Tokens" value="1" icon={Clock} color="var(--warning)" />
        <StatCard title="Prescriptions" value="14" icon={FileText} color="var(--accent)" />
      </div>

      {/* Quick Actions */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Quick Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {quickActions.map((action, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            onClick={() => navigate(action.path)}
            className="glass-card"
            style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', border: `1px solid ${action.color}33` }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${action.color}22`, color: action.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <action.icon size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{action.title}</h3>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>{action.desc}</p>
            </div>
            <ChevronRight size={20} className="text-muted" />
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* Appointments List */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Upcoming Appointments</h2>
            <button className="btn" style={{ fontSize: '0.875rem', color: 'var(--primary)' }} onClick={() => navigate('/patient/history')}>View All</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {upcomingAppointments.map(app => (
              <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                    {app.doctor.charAt(4)}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{app.doctor}</h4>
                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>{app.dept}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{app.date}</p>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>{app.time}</p>
                </div>
                <span className={`badge ${app.status === 'Upcoming' ? 'badge-info' : 'badge-warning'}`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
