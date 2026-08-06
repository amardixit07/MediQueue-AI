import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, CalendarPlus, Clock, Activity, FileText, 
  Users, Stethoscope, LogOut, Menu, X, PlusCircle 
} from 'lucide-react';
import { logout } from '../store/slices/authSlice';

const Sidebar = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = {
    patient: [
      { path: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/patient/book', label: 'Book Appointment', icon: CalendarPlus },
      { path: '/patient/queue', label: 'My Queue', icon: Clock },
      { path: '/patient/symptom-checker', label: 'Symptom Checker', icon: Activity },
      { path: '/patient/history', label: 'Medical History', icon: FileText },
    ],
    doctor: [
      { path: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/doctor/queue', label: 'Patient Queue', icon: Users },
      { path: '/doctor/prescribe', label: 'Write Prescription', icon: PlusCircle },
    ],
    admin: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/admin/doctors', label: 'Manage Doctors', icon: Stethoscope },
    ]
  };

  const currentNav = user ? navItems[user.role] : [];

  const SidebarContent = () => (
    <>
      <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
        <h2 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🏥 MediQueue AI
        </h2>
      </div>

      <div style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {currentNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsOpen(false)}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              color: isActive ? 'white' : 'var(--text-muted)',
              background: isActive ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent',
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'all 0.2s ease'
            })}
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '50%', 
            background: 'var(--primary)', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', fontWeight: 600, fontSize: '1.25rem' 
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name}</p>
            <p className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>{user?.role}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="btn"
          style={{ width: '100%', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="btn btn-secondary"
        style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 1000, display: window.innerWidth > 768 ? 'none' : 'flex' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Sidebar */}
      <div 
        className="glass"
        style={{
          position: 'fixed', top: 0, left: 0, height: '100vh', width: '280px',
          display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)',
          zIndex: 900,
          transform: window.innerWidth > 768 ? 'translateX(0)' : `translateX(${isOpen ? '0' : '-100%'})`,
          transition: 'transform 0.3s ease'
        }}
      >
        <SidebarContent />
      </div>

      {/* Mobile Overlay */}
      {isOpen && window.innerWidth <= 768 && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 800 }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
