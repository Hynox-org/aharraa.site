"use client";
import React from 'react';

const MaintenancePage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '600px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      }}>
        <svg 
          width="120" 
          height="120" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ margin: '0 auto 30px' }}
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          We'll Be Back Soon!
        </h1>
        
        <p style={{
          fontSize: '1.2rem',
          lineHeight: '1.6',
          marginBottom: '30px',
          opacity: '0.9'
        }}>
          Our site is currently undergoing scheduled maintenance. 
          We apologize for any inconvenience and appreciate your patience.
        </p>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          fontSize: '1rem',
          opacity: '0.8'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#4ade80',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}></div>
          <span>We'll be back online shortly</span>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default MaintenancePage;
