import StatusBadge from './StatusBadge';

const UserTable = ({ users, onEdit, onDelete, loading }) => {
  if (loading) return <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading users...</div>;
  if (!users.length) return <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>No users found. Create one above!</div>;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
      <thead>
        <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
          {['ID', 'Name', 'Email', 'Created At', 'Status', 'Actions'].map(h => (
            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.map((user, i) => (
          <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
            <td style={{ padding: '14px 16px', color: '#9ca3af', fontWeight: '600' }}>#{user.id}</td>
            <td style={{ padding: '14px 16px', fontWeight: '600', color: '#111827' }}>{user.name}</td>
            <td style={{ padding: '14px 16px', color: '#6b7280' }}>{user.email}</td>
            <td style={{ padding: '14px 16px', color: '#9ca3af', fontSize: '12px' }}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</td>
            <td style={{ padding: '14px 16px' }}><StatusBadge status={200} /></td>
            <td style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => onEdit(user)} style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid #c7d2fe', background: '#eef2ff', color: '#4f46e5', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Edit</button>
                <button onClick={() => onDelete(user.id)} style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Delete</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;