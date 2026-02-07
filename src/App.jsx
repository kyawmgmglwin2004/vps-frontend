import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Simple styling

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    userName: '',
    source: '',
    paymentType: '',
    date: '',
    planType: ''
  });
  const [editId, setEditId] = useState(null);

  // Fetch Users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get('https://api.vpn.kyawmgmglwin.site/users');
    setUsers(res.data);
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create or Update User
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`https://api.vpn.kyawmgmglwin.site/users/${editId}`, formData);
      setEditId(null);
    } else {
      await axios.post('https://api.vpn.kyawmgmglwin.site/users', formData);
    }
    setFormData({ userName: '', source: '', paymentType: '', date: '', planType: '' });
    fetchUsers();
  };

  // Edit User (Fill form with data)
  const handleEdit = (user) => {
    setFormData(user);
    setEditId(user.id);
  };

  // Delete User
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await axios.delete(`https://api.vpn.kyawmgmglwin.site/users/${id}`);
      fetchUsers();
    }
  };

  return (
    <div className="container">
      <h1 className="title" color='black'>VPN Admin Tool</h1>
      
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="form-card">
        <h2 className='action'>{editId ? 'Edit User' : 'Add New User'}</h2>
        <input name="key_id" placeholder="Key ID" value={formData.key_id} onChange={handleChange} required />
        <input name="userName" placeholder="Username" value={formData.userName} onChange={handleChange} required />
        <input name="source" placeholder="Source (e.g. Facebook)" value={formData.source} onChange={handleChange} />
        <input name="paymentType" placeholder="Payment Type (e.g. Kpay)" value={formData.paymentType} onChange={handleChange} />
        <input type="date" name="started_date" value={formData.started_date} onChange={handleChange} required />
        <select name="planType" value={formData.planType} onChange={handleChange} required>
          <option value="">Select Plan</option>
          <option value="1 Month">1 Month</option>
          <option value="3 Months">3 Months</option>
          <option value="1 Year">1 Year</option>
        </select>
        <select name="deviceType" value={formData.deviceType} onChange={handleChange} required>
          <option value="">Select Device Type</option>
          <option value="phone">Phone</option>
          <option value="Laptop">Laptop</option>
        </select>
        <button type="submit">{editId ? 'Update' : 'Add'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setFormData({userName:'', source:'', paymentType:'', date:'', planType:''}); }}>Cancel</button>}
      </form>

      {/* Table Section */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Key ID</th>
            <th>User Name</th>
            <th>Source</th>
            <th>Payment</th>
            <th>Device Type</th>
            <th>Started Date</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Plan</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.key_id}</td>
              <td>{user.userName}</td>
              <td>{user.source}</td>
              <td>{user.paymentType}</td>
              <td>{user.deviceType}</td>
              <td>{user.started_date}</td>
              <td>{user.created_at}</td>
              <td>{user.updated_at}</td>
              <td>{user.planType}</td>
              <td>
                <button onClick={() => handleEdit(user)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(user.id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;