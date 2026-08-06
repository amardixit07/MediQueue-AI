import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { registerUser, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector(state => state.auth);
  
  const [role, setRole] = useState('patient');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', gender: 'male', dateOfBirth: '',
    // Patient specific
    bloodGroup: 'O+', emergencyContact: '',
    // Doctor specific
    specialization: '', department: 'General', qualification: '', experience: '', consultationFee: ''
  });

  useEffect(() => {
    document.title = 'Register | MediQueue AI';
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'doctor') navigate('/doctor/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/patient/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      return toast.error('Please fill all basic details');
    }
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Clean up data — remove empty fields and map field names correctly
    const submitData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth || undefined,
      role,
    };
    if (role === 'patient') {
      submitData.bloodGroup = formData.bloodGroup || undefined;
    } else {
      submitData.specialization = formData.specialization;
      submitData.department = formData.department;
      submitData.qualification = formData.qualification || undefined;
      submitData.experience = Number(formData.experience) || undefined;
      submitData.consultationFee = Number(formData.consultationFee) || undefined;
    }
    dispatch(registerUser(submitData));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', background: 'var(--bg-dark)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '3rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Create Account</h2>
          <p className="text-muted">Join MediQueue AI today</p>
        </div>

        {/* Role Selector */}
        {step === 1 && (
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            {['patient', 'doctor'].map(r => (
              <div 
                key={r}
                onClick={() => setRole(r)}
                style={{ 
                  flex: 1, padding: '1rem', textAlign: 'center', borderRadius: '0.5rem', cursor: 'pointer',
                  border: `1px solid ${role === r ? 'var(--primary)' : 'var(--border)'}`,
                  background: role === r ? 'rgba(99,102,241,0.1)' : 'transparent',
                  textTransform: 'capitalize', fontWeight: 600, color: role === r ? 'var(--primary)' : 'var(--text-muted)'
                }}
              >
                I am a {r}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="input" required />
                </div>
                <div className="input-group">
                  <label className="input-label">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="input" required />
                </div>
                <div className="input-group">
                  <label className="input-label">Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className="input" required />
                </div>
                <div className="input-group">
                  <label className="input-label">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input" required />
                </div>
                <div className="input-group">
                  <label className="input-label">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="input">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="input" />
                </div>
              </div>
              <button type="button" onClick={handleNext} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Next Step</button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              {role === 'patient' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Blood Group</label>
                    <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="input">
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Emergency Contact</label>
                    <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="input" />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Specialization</label>
                    <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className="input" placeholder="e.g. Cardiologist" required />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Department</label>
                    <select name="department" value={formData.department} onChange={handleChange} className="input">
                      {['General', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Experience (Years)</label>
                    <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="input" required />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Consultation Fee ($)</label>
                    <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} className="input" required />
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setStep(1)} className="btn btn-secondary" style={{ flex: 1 }}>Back</button>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 2 }}>{loading ? 'Registering...' : 'Complete Registration'}</button>
              </div>
            </motion.div>
          )}
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p className="text-muted">
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Login here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
