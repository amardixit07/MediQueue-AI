import React, { useState } from 'react';
import { FileText, Download, Calendar, CreditCard, Search } from 'lucide-react';

const mockHistory = {
  appointments: [
    { id: 1, date: '2026-09-15', doctor: 'Dr. Sarah Wilson', dept: 'Cardiology', status: 'Completed', notes: 'Routine checkup' },
    { id: 2, date: '2026-06-10', doctor: 'Dr. James Smith', dept: 'General', status: 'Completed', notes: 'Fever and cold' },
  ],
  prescriptions: [
    { id: 1, date: '2026-09-15', doctor: 'Dr. Sarah Wilson', diagnosis: 'Mild Hypertension', medicines: ['Amlodipine 5mg OD', 'Aspirin 75mg OD'] },
    { id: 2, date: '2026-06-10', doctor: 'Dr. James Smith', diagnosis: 'Viral URI', medicines: ['Paracetamol 500mg SOS', 'Cetirizine 10mg HS'] },
  ],
  bills: [
    { id: 'INV-001', date: '2026-09-15', amount: 150.00, status: 'Paid', method: 'Credit Card' },
    { id: 'INV-002', date: '2026-06-10', amount: 80.00, status: 'Paid', method: 'Insurance' },
  ]
};

const MedicalHistory = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Medical History</h1>

      <div className="glass-card" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(15,23,42,0.5)', padding: '0.5rem', borderRadius: '0.75rem' }}>
          {[
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
            { id: 'bills', label: 'Billing', icon: CreditCard }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.5rem',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 500,
                background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-muted)'
              }}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search records..." 
            className="input" 
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {activeTab === 'appointments' && (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockHistory.appointments.map(apt => (
                  <tr key={apt.id}>
                    <td>{apt.date}</td>
                    <td>{apt.doctor}</td>
                    <td>{apt.dept}</td>
                    <td><span className="badge badge-success">{apt.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'prescriptions' && (
          <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {mockHistory.prescriptions.map(pres => (
              <div key={pres.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px dashed var(--border)' }}>
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '1.1rem' }}>{pres.doctor}</h4>
                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>{pres.date}</p>
                  </div>
                  <button className="btn btn-secondary" style={{ padding: '0.5rem' }}><Download size={16} /></button>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <span className="text-muted" style={{ fontSize: '0.875rem' }}>Diagnosis:</span>
                  <p style={{ fontWeight: 500 }}>{pres.diagnosis}</p>
                </div>
                <div>
                  <span className="text-muted" style={{ fontSize: '0.875rem' }}>Medicines:</span>
                  <ul style={{ listStylePosition: 'inside', fontSize: '0.9rem', marginTop: '0.5rem', color: 'var(--text-main)' }}>
                    {pres.medicines.map((med, i) => <li key={i}>{med}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'bills' && (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {mockHistory.bills.map(bill => (
                  <tr key={bill.id}>
                    <td style={{ fontWeight: 500 }}>{bill.id}</td>
                    <td>{bill.date}</td>
                    <td>${bill.amount.toFixed(2)}</td>
                    <td>{bill.method}</td>
                    <td><span className="badge badge-success">{bill.status}</span></td>
                    <td><button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Download</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistory;
