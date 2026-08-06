import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './store/slices/authSlice';
import ProtectedRoute from './components/ProtectedRoute';
import AIChatAgent from './components/AIChatAgent';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import BookAppointment from './pages/patient/BookAppointment';
import QueueTracker from './pages/patient/QueueTracker';
import AISymptomChecker from './pages/patient/AISymptomChecker';
import MedicalHistory from './pages/patient/MedicalHistory';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientQueue from './pages/doctor/PatientQueue';
import WritePrescription from './pages/doctor/WritePrescription';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageDoctors from './pages/admin/ManageDoctors';

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Patient Routes */}
        <Route path="/patient" element={<ProtectedRoute allowedRoles={['patient']} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="book" element={<BookAppointment />} />
          <Route path="queue" element={<QueueTracker />} />
          <Route path="symptom-checker" element={<AISymptomChecker />} />
          <Route path="history" element={<MedicalHistory />} />
        </Route>

        {/* Doctor Routes */}
        <Route path="/doctor" element={<ProtectedRoute allowedRoles={['doctor']} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="queue" element={<PatientQueue />} />
          <Route path="prescribe" element={<WritePrescription />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="doctors" element={<ManageDoctors />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global AI Chat Agent — visible on every page */}
      <AIChatAgent />
    </>
  );

}

export default App;
