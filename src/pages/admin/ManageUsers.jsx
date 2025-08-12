import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "owner" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:9090/api/users");
      setUsers(res.data.filter(user => user.role !== "admin")); // exclude admin
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isStrongPassword = (pwd) =>
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%?#&])[A-Za-z\d@$!%?#&]{6,}$/.test(pwd);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generatePassword = () => {
    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@$!%?#&';
    let pwd = '';
    while (!isStrongPassword(pwd)) {
      pwd = Array.from({ length: 10 }, () => charset[Math.floor(Math.random() * charset.length)]).join('');
    }
    setForm({ ...form, password: pwd });
    setShowPassword(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`Email: ${form.email}\nPassword: ${form.password}`);
      setSuccess('Credentials copied to clipboard.');
      setTimeout(() => setSuccess(''), 2000);
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

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
        setSuccess('User updated.');
      } else {
        await axios.post("http://localhost:9090/api/users", form);
        setSuccess('User created. Share the credentials below.');
      }

      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user.');
    }
  };

  const handleEdit = (user) => {
    setForm({ username: user.username, email: user.email, password: '', role: user.role });
    setEditId(user.id);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:9090/api/users/${id}`);
      fetchUsers();
    } catch {
      alert("Failed to delete user.");
    }
  };

  const handleResetForm = () => {
    setForm({ username: "", email: "", password: "", role: "owner" });
    setEditId(null);
    setShowPassword(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Manage Users</h4>

      <form onSubmit={handleSubmit} className="row g-2 mb-3 align-items-end">
        <div className="col-md-3">
          <label className="form-label small mb-1">Username</label>
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
          <label className="form-label small mb-1">Email</label>
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
          <label className="form-label small mb-1">{editId ? 'New Password (optional)' : 'Password'}</label>
          <div className="input-group input-group-sm">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              placeholder={editId ? "New Password (optional)" : "Password"}
              value={form.password}
              onChange={handleChange}
              required={!editId}
            />
            {!editId && (
              <button type="button" className="btn btn-outline-secondary" onClick={generatePassword}>
                Auto
              </button>
            )}
            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(v => !v)}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div className="col-md-2">
          <label className="form-label small mb-1">Role</label>
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

        <div className="col-md-2 d-grid">
          <button type="submit" className="btn btn-primary btn-sm">
            {editId ? "Update" : "Add"}
          </button>
        </div>

        <div className="col-12 d-flex gap-2 mt-1">
          {!editId && form.email && form.password && (
            <button type="button" className="btn btn-outline-success btn-sm" onClick={handleCopy}>Copy Credentials</button>
          )}
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleResetForm}>Reset</button>
        </div>

        {error && (
          <div className="col-12 text-danger small mt-1">{error}</div>
        )}
        {success && (
          <div className="col-12 text-success small mt-1">{success}</div>
        )}
      </form>

      {!editId && form.email && form.password && (
        <div className="alert alert-info py-2 small">
          <div><strong>Share with user:</strong></div>
          <div>Email: {form.email}</div>
          <div>Password: {form.password}</div>
        </div>
      )}

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
