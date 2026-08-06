import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, color = 'var(--primary)' }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
      style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>{title}</p>
          <h3 style={{ fontSize: '1.875rem', fontWeight: 700 }}>{value}</h3>
        </div>
        <div style={{ 
          padding: '0.75rem', 
          borderRadius: '0.75rem', 
          background: `color-mix(in srgb, ${color} 15%, transparent)`,
          color: color
        }}>
          <Icon size={24} />
        </div>
      </div>
      
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <span style={{ 
            display: 'flex', 
            alignItems: 'center', 
            color: trend > 0 ? 'var(--accent)' : 'var(--danger)',
            fontWeight: 500
          }}>
            {trend > 0 ? <TrendingUp size={16} style={{ marginRight: '4px' }}/> : <TrendingDown size={16} style={{ marginRight: '4px' }}/>}
            {Math.abs(trend)}%
          </span>
          <span className="text-muted">vs last month</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
