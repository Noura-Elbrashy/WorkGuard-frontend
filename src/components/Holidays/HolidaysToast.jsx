// src/components/Holidays/HolidaysToast.jsx
import React, { useEffect } from 'react';

const HolidaysToast = ({ show, type, message, onClose, delay = 5000 }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [show, delay, onClose]);

  if (!show) return null;

  return (
    <div className={`hm-toast hm-toast-${type}`}>
      <i className={`fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
      <span>{message}</span>
      <button onClick={onClose} className="hm-toast-close">
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default HolidaysToast;