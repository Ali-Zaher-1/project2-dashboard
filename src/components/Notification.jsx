const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  const styles = {
    success: { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' },
    error: { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
  };

  const s = styles[type] || styles.success;

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 16px', borderRadius: '8px', marginBottom: '20px',
      backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontSize: '14px', fontWeight: '500'
    }}>
      <span>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: s.color, lineHeight: 1 }}>×</button>
    </div>
  );
};

export default Notification;