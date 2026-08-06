import React, { useState } from 'react';
import { Check, X, Search, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';

const mockDoctors = [
  { id: 1, name: 'Dr. Sarah Wilson', dept: 'Cardiology', exp: 15, fee: 150, status: 'active' },
  { id: 2, name: 'Dr. James Smith', dept: 'General', exp: 8, fee: 80, status: 'active' },
  { id: 3, name: 'Dr. Emily Chen', dept: 'Neurology', exp: 12, fee: 200, status: 'pending' },
  { id: 4, name: 'Dr. Robert Davis', dept: 'Orthopedics', exp: 20, fee: 180, status: 'pending' },
];

const ManageDoctors = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [doctors, setDoctors] = useState(mockDoctors);

  const handleApprove = (id) => {
    setDoctors(doctors.map(d => d.id === id ? { ...d, status: 'active' } : d));
    toast.success('Doctor approved successfully');
  };

  const handleReject = (id) => {
    setDoctors(doctors.map(d => d.id === id ? { ...d, status: 'rejected' } : d));
    toast.error('Doctor application rejected');
  };

  const filteredDoctors = doctors.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.dept.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'pending') return matchesSearch && d.status === 'pending';
    return matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Manage Doctors</h1>

      <div className="glass-card" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(15,23,42,0.5)', padding: '0.5rem', borderRadius: '0.75rem' }}>
          <button onClick={() => setActiveTab('all')} style={{ padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: 'none', background: activeTab === 'all' ? 'var(--primary)' : 'transparent', color: activeTab === 'all' ? 'white' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 500 }}>All Doctors</button>
          <button onClick={() => setActiveTab('pending')} style={{ padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: 'none', background: activeTab === 'pending' ? 'var(--warning)' : 'transparent', color: activeTab === 'pending' ? 'white' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 500, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            Pending Approval <span style={{ background: 'white', color: 'var(--warning)', borderRadius: '999px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 700 }}>{doctors.filter(d=>d.status==='pending').length}</span>
          </button>
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search name or department..." 
            className="input" 
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Doctor Profile</th>
              <th>Department</th>
              <th>Experience</th>
              <th>Cons. Fee</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map(doc => (
              <tr key={doc.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                      {doc.name.charAt(4)}
                    </div>
                    <span style={{ fontWeight: 600 }}>{doc.name}</span>
                  </div>
                </td>
                <td>{doc.dept}</td>
                <td>{doc.exp} Years</td>
                <td>${doc.fee}</td>
                <td>
                  <span className={`badge badge-${doc.status === 'active' ? 'success' : doc.status === 'pending' ? 'warning' : 'danger'}`}>
                    {doc.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {doc.status === 'pending' ? (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => handleApprove(doc.id)} className="btn btn-secondary" style={{ padding: '0.5rem', borderColor: 'var(--accent)', color: 'var(--accent)' }}><Check size={16} /></button>
                      <button onClick={() => handleReject(doc.id)} className="btn btn-secondary" style={{ padding: '0.5rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}><X size={16} /></button>
                    </div>
                  ) : (
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}><MoreVertical size={20} /></button>
                  )}
                </td>
              </tr>
            ))}
            {filteredDoctors.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No doctors found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageDoctors;
