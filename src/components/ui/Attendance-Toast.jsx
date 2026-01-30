// src/components/ui/Toast.jsx
import { useEffect, useState } from 'react';
import '../../style/attendance-modern.css';

function Toast({
  show,
  message,
  type = 'success',
  onClose,
  delay = 5000
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      // Small delay to trigger animation
      setTimeout(() => setIsVisible(true), 10);

      // Auto-hide after delay
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for exit animation
      }, delay);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show, delay, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!show) return null;

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div className={`toast-notification toast-${type} ${isVisible ? 'toast-show' : ''}`}>
      <div className="toast-icon">{icons[type]}</div>
      <div className="toast-message">{message}</div>
      <button 
        className="toast-close" 
        onClick={handleClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;