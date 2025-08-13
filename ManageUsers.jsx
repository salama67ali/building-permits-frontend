import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "owner" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const checkAdminStatus = () => {
    const userRole = localStorage.getItem('currentUserRole');
    const isAdminUser = userRole === 'admin';
    setIsAdmin(isAdminUser);
    
    if (!isAdminUser) {
      setError('Access denied. Admin privileges required.');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:9090/api/users");
      setUsers(res.data.filter(user => user.role !== "admin")); // exclude admin
    } catch (error) {
      console.error("Error fetching users:", error);
      setError('Failed to fetch users.');
    }
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isStrongPassword = (pwd) =>
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%?#&])[A-Za-z\d@$!%?#&]{6,}$/.test(pwd);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.username || !form.email || !form.role || (!editId && !form.password)) {
      return setError('All fields are required.');
    }

    if (!isValidEmail(form.email)) {
      return setError('Invalid email format.');
    }

    if (!editId && !isStrongPassword(form.password)) {
      return setError(
        'Password must be at least 6 characters with uppercase, lowercase, number, and special character.'
      );
    }

    const duplicate = users.some(u => u.email === form.email && u.id !== editId);
    if (duplicate) return setError("Email already exists!");

    try {
      if (editId) {
        const updatedForm = { ...form };
        if (!form.password) delete updatedForm.password;
        await axios.put(`http://localhost:9090/api/users/${editId}`, updatedForm);
        setEditId(null);
        setError('');
      } else {
        await axios.post("http://localhost:9090/api/users", form);
        setError('');
      }

      setForm({ username: "", email: "", password: "", role: "owner" });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user.');
    }
  };

  const handleEdit = (user) => {
    setForm({ username: user.username, email: user.email, password: '', role: user.role });
    setEditId(user.id);
    setError('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:9090/api/users/${id}`);
        fetchUsers();
        setError('');
      } catch (err) {
        setError('Failed to delete user.');
      }
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ username: "", email: "", password: "", role: "owner" });
    setError('');
  };

  if (!isAdmin) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4>Access Denied</h4>
          <p>You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Manage Users</h4>

      <form onSubmit={handleSubmit} className="row g-2 mb-4">
        <div className="col-md-3">
          <input
            name="username"
            className="form-control form-control-sm"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-3">
          <input
            name="email"
            type="email"
            className="form-control form-control-sm"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={!!editId}
          />
        </div>

        <div className="col-md-2">
          <input
            name="password"
            type="password"
            className="form-control form-control-sm"
            placeholder={editId ? "New Password (optional)" : "Password"}
            value={form.password}
            onChange={handleChange}
            required={!editId}
          />
        </div>

        <div className="col-md-2">
          <select
            name="role"
            className="form-select form-select-sm"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="owner">Owner</option>
            <option value="consultant">Consultant</option>
            <option value="engineer">Engineer</option>
            <option value="government-board">Government Board</option>
          </select>
        </div>

        <div className="col-md-2 d-grid gap-1">
          <button type="submit" className="btn btn-primary btn-sm">
            {editId ? "Update" : "Add"}
          </button>
          {editId && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>

        {error && (
          <div className="col-12 text-danger small mt-1">{error}</div>
        )}
      </form>

      <table className="table table-sm table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => handleEdit(u)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(u.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-muted">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;