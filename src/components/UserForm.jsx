import { useState } from 'react';

const UserForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (form.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const inputStyle = (field) => ({
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: `1px solid ${errors[field] ? '#f87171' : '#d1d5db'}`,
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  });

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Full Name</label>
        <input
          style={inputStyle('name')}
          placeholder="e.g. Charlie Brown"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        {errors.name && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.name}</p>}
      </div>
      <div>
        <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Email Address</label>
        <input
          style={inputStyle('email')}
          placeholder="e.g. charlie@example.com"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.email}</p>}
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{
            padding: '9px 18px', borderRadius: '8px',
            border: '1px solid #d1d5db', background: 'white',
            cursor: 'pointer', fontSize: '14px'
          }}>
            Cancel
          </button>
        )}
        <button type="submit" style={{
          padding: '9px 18px', borderRadius: '8px',
          border: 'none', background: '#4f46e5',
          color: 'white', cursor: 'pointer',
          fontSize: '14px', fontWeight: '600'
        }}>
          {initialData ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;