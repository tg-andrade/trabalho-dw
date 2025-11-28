import { useEffect } from 'react';

const Notification = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0 && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const typeStyles = {
    success: {
      background: 'rgba(81, 207, 102, 0.2)',
      borderColor: '#51cf66',
      color: '#51cf66'
    },
    error: {
      background: 'rgba(255, 107, 107, 0.2)',
      borderColor: '#ff6b6b',
      color: '#ff6b6b'
    },
    info: {
      background: 'rgba(198, 40, 40, 0.2)',
      borderColor: '#c62828',
      color: '#c62828'
    }
  };

  const style = typeStyles[type] || typeStyles.info;

  return (
    <div
      className="notification"
      style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        padding: '1rem 1.5rem',
        background: style.background,
        border: `2px solid ${style.borderColor}`,
        borderRadius: '8px',
        color: style.color,
        zIndex: 10000,
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        animation: 'slideInRight 0.3s ease-out'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <span>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '0',
              lineHeight: '1'
            }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Notification;

