import React, { useState } from 'react';
import { login, register } from '../services/api';

const LoginModal = ({ onLogin, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let response;
      if (isLogin) {
        // Login
        response = await login({
          username: formData.username,
          password: formData.password
        });
        console.log('Login response:', response.data);
      } else {
        // Register validation
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        
        response = await register({
          username: formData.username,
          email: formData.email,
          name: formData.name || formData.username,
          password: formData.password
        });
        console.log('Register response:', response.data);
      }
      
      // Handle successful authentication
      if (response && response.data && response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('project2_user', JSON.stringify(response.data.user));
        
        // Call the onLogin callback with user data
        if (onLogin) {
          onLogin(response.data.user);
        }
        
        // Close the modal
        if (onClose) {
          onClose();
        }
      } else {
        setError(response?.data?.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.response?.data?.error || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      username: '',
      email: '',
      name: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'rgba(10, 20, 50, 0.95)',
          border: '1px solid rgba(0, 100, 255, 0.3)',
          borderRadius: '20px',
          padding: '40px',
          width: '450px',
          maxWidth: '90%',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#aaa',
            fontSize: '28px',
            cursor: 'pointer',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.color = '#fff'}
          onMouseLeave={(e) => e.target.style.color = '#aaa'}
        >
          ×
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '15px',
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px auto'
            }}
          >
            <span style={{ fontSize: '30px' }}>{isLogin ? '🔐' : '✏️'}</span>
          </div>
          <h2 style={{ color: '#7dd3fc', fontFamily: "'Orbitron', monospace", fontSize: '24px', marginBottom: '5px' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ color: 'rgba(160,210,255,0.5)', fontSize: '12px' }}>
            {isLogin ? 'Login to access your dashboard' : 'Register to start your journey'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              background: 'rgba(255, 51, 102, 0.15)',
              border: '1px solid rgba(255, 51, 102, 0.3)',
              borderRadius: '10px',
              padding: '12px',
              marginBottom: '20px',
              color: '#ff6699',
              fontSize: '13px',
              textAlign: 'center'
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '11px',
                fontWeight: '600',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: 'rgba(160,210,255,0.6)'
              }}
            >
              Username / Email
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              style={{
                width: '100%',
                padding: '12px 15px',
                background: 'rgba(0, 20, 60, 0.7)',
                border: '1px solid rgba(0, 100, 255, 0.3)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0, 100, 255, 0.3)'}
            />
          </div>

          {/* Email Field (Register only) */}
          {!isLogin && (
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: 'rgba(160,210,255,0.6)'
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required={!isLogin}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  background: 'rgba(0, 20, 60, 0.7)',
                  border: '1px solid rgba(0, 100, 255, 0.3)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(0, 100, 255, 0.3)'}
              />
            </div>
          )}

          {/* Name Field (Register only) */}
          {!isLogin && (
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: 'rgba(160,210,255,0.6)'
                }}
              >
                Full Name (Optional)
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  background: 'rgba(0, 20, 60, 0.7)',
                  border: '1px solid rgba(0, 100, 255, 0.3)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(0, 100, 255, 0.3)'}
              />
            </div>
          )}

          {/* Password Field */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '11px',
                fontWeight: '600',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: 'rgba(160,210,255,0.6)'
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '12px 15px',
                background: 'rgba(0, 20, 60, 0.7)',
                border: '1px solid rgba(0, 100, 255, 0.3)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0, 100, 255, 0.3)'}
            />
          </div>

          {/* Confirm Password Field (Register only) */}
          {!isLogin && (
            <div style={{ marginBottom: '25px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: 'rgba(160,210,255,0.6)'
                }}
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required={!isLogin}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  background: 'rgba(0, 20, 60, 0.7)',
                  border: '1px solid rgba(0, 100, 255, 0.3)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(0, 100, 255, 0.3)'}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontFamily: "'Orbitron', monospace",
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s',
              opacity: loading ? 0.7 : 1,
              marginBottom: '20px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 5px 20px rgba(124, 58, 237, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {loading ? (
              <span>⏳ Processing...</span>
            ) : (
              isLogin ? '🔓 Login' : '📝 Register'
            )}
          </button>
        </form>

        {/* Switch Mode Link */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={switchMode}
            style={{
              background: 'none',
              border: 'none',
              color: '#7dd3fc',
              fontSize: '13px',
              cursor: 'pointer',
              textDecoration: 'underline',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#a78bfa'}
            onMouseLeave={(e) => e.target.style.color = '#7dd3fc'}
          >
            {isLogin ? "Don't have an account? Create one" : "Already have an account? Login"}
          </button>
        </div>

        {/* Demo Credentials Hint */}
        <div
          style={{
            marginTop: '20px',
            padding: '10px',
            background: 'rgba(0, 100, 255, 0.1)',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '10px',
            color: 'rgba(160,210,255,0.4)'
          }}
        >
          {isLogin ? (
            <span>💡 Demo: Use any registered account</span>
          ) : (
            <span>💡 Password must be at least 6 characters</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;