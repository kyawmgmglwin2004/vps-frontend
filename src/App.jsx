import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);

  const initialForm = {
    key_id: '',
    deviceType: '',
    started_date: '',
    userName: '',
    source: '', 
    paymentType: '', 
    planType: ''
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://api.vpn.kyawmgmglwin.site/users');
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`https://api.vpn.kyawmgmglwin.site/users/${editId}`, formData);
      } else {
        await axios.post('https://api.vpn.kyawmgmglwin.site/users', formData);
      }
      
      setFormData(initialForm);
      setEditId(null);
      fetchUsers();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (user) => {
    setFormData(user);
    setEditId(user.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      try {
        await axios.delete(`https://api.vpn.kyawmgmglwin.site/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className="container">
      {/* Form Section */}
        <h2 className='action'>{editId ? 'Edit User' : 'Add New User'}</h2>

      <form onSubmit={handleSubmit} className="form-card">
        
        <input style={{ width: '12%' }} name="key_id" placeholder="Key ID" value={formData.key_id} onChange={handleChange} required />
        <input name="userName" placeholder="Username" value={formData.userName} onChange={handleChange} required />
        
        {/* --- Source Dropdown --- */}
        <select name="source" value={formData.source} onChange={handleChange} required>
          <option value="">Source</option>
          <option value="Facebook">Facebook</option>
          <option value="Tiktok">Tiktok</option>
          <option value="Telegram">Telegram</option>
        </select>

        {/* --- Payment Type Dropdown --- */}
        <select name="paymentType" value={formData.paymentType} onChange={handleChange} required>
          <option value="">Payment</option>
          <option value="Kpay">Kpay</option>
          <option value="Wave">Wave</option>
          <option value="AYA">AYA</option>
        </select>

        <input type="date" name="started_date" value={formData.started_date} onChange={handleChange} required />
        
        <select name="planType" value={formData.planType} onChange={handleChange} required>
          <option value="">Plan</option>
          <option value="1 Month">1 Month</option>
          <option value="3 Months">3 Months</option>
          <option value="1 Year">1 Year</option>
        </select>
        
        <select name="deviceType" value={formData.deviceType} onChange={handleChange} required>
          <option value="">Device Type</option>
          <option value="phone">Phone</option>
          <option value="Laptop">Laptop</option>
        </select>
        
        <button type="submit">{editId ? 'Update' : 'Add'}</button>
        
        {editId && (
          <button 
            type="button" 
            onClick={() => { 
              setEditId(null); 
              setFormData(initialForm); 
            }}
            style={{ marginLeft: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer', borderRadius: '4px' }}
          >
            Cancel
          </button>
        )}
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