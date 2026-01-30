// src/components/ui/Toast.jsx
import { useEffect, useRef } from 'react';
import { Toast as BsToast } from 'bootstrap';




function Toast({
  show,
  message,
  type = 'success',
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  delay = 5000
}) {
  const toastRef = useRef(null);
  const bsToast = useRef(null);

//   useEffect(() => {
//     if (!toastRef.current) return;

//     // bsToast.current = new BsToast(toastRef.current, {
//     //   autohide: !onConfirm,
//     //   delay: onConfirm ? undefined : delay
//     // });
// const config = {
//   autohide: !onConfirm
// };

// if (!onConfirm) {
//   config.delay = delay;
// }

// bsToast.current = new BsToast(toastRef.current, config);

//     const el = toastRef.current;
//     el.addEventListener('hidden.bs.toast', onClose);

//     return () => {
//       el.removeEventListener('hidden.bs.toast', onClose);
//       if (bsToast.current) {
//       bsToast.current.dispose(); // 👈 مهم
//       bsToast.current = null;
//     }
//     };
//   }, [message, type, onConfirm, delay]);
const onCloseRef = useRef(onClose);

useEffect(() => {
  onCloseRef.current = onClose;
}, [onClose]);

useEffect(() => {
  if (!toastRef.current) return;

  const config = {
    autohide: !onConfirm
  };

  if (!onConfirm) {
    config.delay = delay;
  }

  bsToast.current = new BsToast(toastRef.current, config);

  const el = toastRef.current;
  const handleHidden = () => {
    onCloseRef.current?.();
  };

  el.addEventListener('hidden.bs.toast', handleHidden);

  return () => {
    el.removeEventListener('hidden.bs.toast', handleHidden);

    if (bsToast.current) {
      bsToast.current.dispose();
      bsToast.current = null;
    }
  };
}, [message, type, onConfirm, delay]);

  useEffect(() => {
    if (show && bsToast.current) {
      bsToast.current.show();
    }
  }, [show]);

  const bgClass =
    type === 'success'
      ? 'bg-success'
      : type === 'error'
      ? 'bg-danger'
      : 'bg-warning';
const handleClose = () => {
  if (bsToast.current) {
    bsToast.current.hide();
  }
};

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      <div ref={toastRef} className={`toast text-white ${bgClass}`}>
        <div className="toast-body">
          <div className="mb-2">{message}</div>

          {onConfirm ? (
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-light btn-sm"
                onClick={handleClose}

              >
                {cancelText}
              </button>
             <button
  className="btn btn-dark btn-sm"
  onClick={async () => {
    await onConfirm();
    bsToast.current.hide();
  }}
>
  {confirmText}
</button>

            </div>
          ) : (
            <button
              className="btn-close btn-close-white position-absolute top-0 end-0 m-2"
              onClick={handleClose}

            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Toast;
