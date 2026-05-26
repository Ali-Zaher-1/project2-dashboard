import { useState, useEffect, useCallback } from 'react';
import { getUsers, getUserById, createUser, updateUser, deleteUser, getHealth } from '../services/api';

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [health, setHealth] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch all users with pagination
const fetchUsers = useCallback(async (page = 1, limit = 5) => {
  setLoading(true);
  setError(null);
  try {
    const response = await getUsers(page, limit);
    // Your backend returns: { status: 'success', data: [...], pagination: {...} }
    const usersData = response.data?.data || response.data || [];
    const paginationData = response.data?.pagination || null;
    setUsers(Array.isArray(usersData) ? usersData : []);
    setPagination(paginationData);
  } catch (err) {
    console.error('Fetch users error:', err);
    setError(err.message);
    setUsers([]);
  } finally {
    setLoading(false);
  }
}, []);

  // Check API health
  const checkHealth = useCallback(async () => {
    try {
      const response = await getHealth();
      const healthData = response.data || response;
      setHealth(healthData);
      return healthData;
    } catch (err) {
      console.error('Health check failed:', err);
      setHealth(null);
      return null;
    }
  }, []);

  // Get single user
  const fetchUserById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserById(id);
      return response.data || response;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add new user
  const addUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createUser(userData);
      const newUser = response.data?.data || response.data || response;
      setUsers(prev => [...prev, newUser]);
      setNotification({ message: `User "${newUser.name || newUser.username}" created!`, type: 'success' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      return newUser;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      setNotification({ message: errorMsg, type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Edit user
  const editUser = async (id, userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateUser(id, userData);
      const updatedUser = response.data?.data || response.data || response;
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
      setNotification({ message: `User "${updatedUser.name || updatedUser.username}" updated!`, type: 'success' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      return updatedUser;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      setNotification({ message: errorMsg, type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove user
  const removeUser = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
      setNotification({ message: 'User deleted successfully!', type: 'success' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      setNotification({ message: errorMsg, type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Edit button clicked
  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(false);
  };

  // Page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchUsers(page);
  };

  // Create user handler
  const handleCreate = async (userData) => {
    await addUser(userData);
    setShowForm(false);
  };

  // Update user handler
  const handleUpdate = async (userData) => {
    if (editingUser) {
      await editUser(editingUser.id, userData);
      setEditingUser(null);
    }
  };

  // Delete user handler
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await removeUser(id);
    }
  };

  // Load users on mount
  useEffect(() => {
    fetchUsers(1);
    checkHealth();
    
    // Refresh health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [fetchUsers, checkHealth]);

  const apiStatus = health ? { ok: true, data: health } : { ok: false };

  return {
    users,
    pagination,
    loading,
    error,
    notification,
    currentPage,
    apiStatus,
    editingUser,
    showForm,
    setShowForm,
    setEditingUser,
    setNotification,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleEdit,
    handlePageChange,
    fetchUsers,
    fetchUserById,
    addUser,
    editUser,
    removeUser,
    checkHealth
  };
};

export { useUsers };
export default useUsers;