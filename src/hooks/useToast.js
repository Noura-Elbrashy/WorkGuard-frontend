import { useState } from 'react';

export default function useToast() {
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
    onConfirm: null
  });

  const showToast = ({
    message,
    type = 'success',
    onConfirm
  }) => {
    setToast({ show: true, message, type, onConfirm });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  return {
    toast,
    showToast,
    hideToast
  };
}
