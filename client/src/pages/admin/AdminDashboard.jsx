import React from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, Stethoscope, Calendar as CalendarIcon, DollarSign } from 'lucide-react';
import StatCard from '../../components/StatCard';

const mockBarData = [
  { name: 'Mon', apps: 40 }, { name: 'Tue', apps: 30 }, { name: 'Wed', apps: 55 },
  { name: 'Thu', apps: 45 }, { name: 'Fri', apps: 60 }, { name: 'Sat', apps: 20 }, { name: 'Sun', apps: 10 },
];

const mockPieData = [
  { name: 'Completed', value: 400, color: '#10b981' },
  { name: 'Pending', value: 300, color: '#f59e0b' },
  { name: 'Cancelled', value: 100, color: '#ef4444' },
];

const mockRevenueData = [
  { name: 'Mon', revenue: 4000 }, { name: 'Tue', revenue: 3000 }, { name: 'Wed', revenue: 5500 },
  { name: 'Thu', revenue: 4500 }, { name: 'Fri', revenue: 6000 }, { name: 'Sat', revenue: 2000 }, { name: 'Sun', revenue: 1000 },
];

const AdminDashboard = () => {
  const { user } = useSelector(state => state.auth);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>
        Admin Dashboard
      </h1>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <StatCard title="Total Patients" value="1,245" icon={Users} color="var(--primary)" trend={5} />
        <StatCard title="Total Doctors" value="48" icon={Stethoscope} color="var(--secondary)" trend={2} />
        <StatCard title="Appointments Today" value="156" icon={CalendarIcon} color="var(--accent)" trend={-3} />
        <StatCard title="Revenue Today" value="$12,450" icon={DollarSign} color="var(--warning)" trend={15} />
      </div>

      {/* Charts Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Appointments (Last 7 Days)</h2>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="apps" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Revenue Trend</h2>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Recent Appointments Table */}
        <div className="glass-card" style={{ padding: '2rem', overflowX: 'auto' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Recent Appointments</h2>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4].map(i => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>Patient Name {i}</td>
                  <td>Dr. Sarah Wilson</td>
                  <td>Cardiology</td>
                  <td>Oct 25, 2026</td>
                  <td><span className="badge badge-success">Completed</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Appointment Status Pie */}
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Status Distribution</h2>
          <div style={{ flex: 1, minHeight: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={mockPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {mockPieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {mockPieData.map((entry, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: entry.color }} />
                <span className="text-muted">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
