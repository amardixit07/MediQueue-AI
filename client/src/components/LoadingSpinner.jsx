import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: 'var(--bg-dark)',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999
    }}>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.5, 1],
          repeat: Infinity,
        }}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: '4px solid transparent',
          borderTopColor: 'var(--primary)',
          borderBottomColor: 'var(--secondary)',
          marginBottom: '1rem'
        }}
      />
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, yoyo: Infinity }}
        className="gradient-text"
        style={{ fontWeight: 600, fontSize: '1.25rem' }}
      >
        MediQueue AI
      </motion.h2>
    </div>
  );
};

export default LoadingSpinner;
