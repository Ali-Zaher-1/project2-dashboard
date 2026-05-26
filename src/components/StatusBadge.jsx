const StatusBadge = ({ status }) => {
  const getColor = (status) => {
    if (status >= 200 && status < 300) return { bg: '#d1fae5', color: '#065f46' };
    if (status >= 400 && status < 500) return { bg: '#fee2e2', color: '#991b1b' };
    if (status >= 500) return { bg: '#fef3c7', color: '#92400e' };
    return { bg: '#e0e7ff', color: '#3730a3' };
  };

  const colors = getColor(status);

  return (
    <span style={{
      backgroundColor: colors.bg,
      color: colors.color,
      padding: '2px 10px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: '600'
    }}>
      {status}
    </span>
  );
};

export default StatusBadge;