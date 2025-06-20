import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

// NOTE: This page expects a backend endpoint /api/user/all that returns all users/admins. Make sure to implement this in the backend.

function Admins() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [form, setForm] = useState({ username: '', email: '', password: '', confirmpassword: '' });
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAdmins = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('accessToken');
            const res = await axios.get('https://car-backend-b17f.onrender.com/api/user/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAdmins(res.data);
        } catch (err) {
            setError('Failed to load admins.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleAdd = () => {
        setForm({ username: '', email: '', password: '', confirmpassword: '' });
        setFormError('');
        setFormSuccess('');
        setShowAddModal(true);
    };

    const handleEdit = (admin) => {
        setSelectedAdmin(admin);
        setForm({ username: admin.username, email: admin.email, password: '', confirmpassword: '' });
        setFormError('');
        setFormSuccess('');
        setShowEditModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this admin?')) return;
        try {
            const token = localStorage.getItem('accessToken');
            await axios.delete(`https://car-backend-b17f.onrender.com/api/user/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAdmins();
        } catch (err) {
            alert('Failed to delete admin.');
        }
    };

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormSuccess('');
        if (!form.username || !form.email || (showAddModal && (!form.password || !form.confirmpassword))) {
            setFormError('All fields are required.');
            return;
        }
        if (form.password !== form.confirmpassword) {
            setFormError('Passwords do not match.');
            return;
        }
        try {
            const token = localStorage.getItem('accessToken');
            if (showAddModal) {
                await axios.post('https://car-backend-b17f.onrender.com/api/user/register', {
                    username: form.username,
                    email: form.email,
                    password: form.password,
                    confirmpassword: form.confirmpassword
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFormSuccess('Admin created! Please ask the new admin to verify their email.');
            } else if (showEditModal && selectedAdmin) {
                await axios.put(`https://car-backend-b17f.onrender.com/api/user/update/${selectedAdmin._id}`, {
                    username: form.username
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFormSuccess('Admin updated!');
            }
            fetchAdmins();
            setTimeout(() => {
                setShowAddModal(false);
                setShowEditModal(false);
            }, 1500);
        } catch (err) {
            setFormError(err.response?.data?.error || 'Failed to submit.');
        }
    };

    // Filtered admins for search
    const filteredAdmins = admins.filter(admin => {
        const searchLower = searchTerm.toLowerCase();
        return (
            admin.username?.toLowerCase().includes(searchLower) ||
            admin.email?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <>
            <Navbar />
            <div className="container-fluid px-0 overflow-hidden">
                <div className="row">
                    <div className="col-lg-3 col-md-4 col-sm-12 p-0 bg-dark">
                        <Sidebar />
                    </div>
                    <div className="col-lg-9 col-md-8 col-sm-12 p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4 pb-3">
                            <h2>Admins</h2>
                            <div className="d-flex align-items-center gap-3">
                                <div className="search-box position-relative">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search admins..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ paddingLeft: '35px', minWidth: '250px' }}
                                    />
                                    <i className="fas fa-search position-absolute"
                                        style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }}></i>
                                </div>
                                <button
                                    className="btn btn-success rounded-circle d-flex align-items-center justify-content-center"
                                    onClick={handleAdd}
                                    style={{ width: '40px', height: '40px' }}
                                >
                                    <i className="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        {loading ? <p>Loading...</p> : error ? <p style={{ color: 'red' }}>{error}</p> : (
                            <div className="table-responsive">
                                <table className="table table-bordered w-100">
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Verified</th>
                                            <th>Active</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAdmins.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center">
                                                    {searchTerm ? 'No matching admins found' : 'No admins found'}
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredAdmins.map(admin => (
                                                <tr key={admin._id}>
                                                    <td>{admin.username}</td>
                                                    <td>{admin.email}</td>
                                                    <td>{admin.isVerified ? 'Yes' : 'No'}</td>
                                                    <td>{admin.isActive ? 'Yes' : 'No'}</td>
                                                    <td>
                                                        <button className="btn btn-link text-primary p-0 me-2" onClick={() => handleEdit(admin)}>
                                                            <i className="fas fa-pencil-alt"></i>
                                                        </button>
                                                        <button className="btn btn-link text-danger p-0" onClick={() => handleDelete(admin._id)}>
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Add Modal */}
                        {showAddModal && (
                            <div className="modal show d-block" tabIndex="-1">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Add Admin</h5>
                                            <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                                        </div>
                                        <form onSubmit={handleFormSubmit}>
                                            <div className="modal-body">
                                                <input className="form-control my-2" name="username" placeholder="Username" value={form.username} onChange={handleFormChange} required />
                                                <input className="form-control my-2" name="email" type="email" placeholder="Email" value={form.email} onChange={handleFormChange} required />
                                                <input className="form-control my-2" name="password" type="password" placeholder="Password" value={form.password} onChange={handleFormChange} required />
                                                <input className="form-control my-2" name="confirmpassword" type="password" placeholder="Confirm Password" value={form.confirmpassword} onChange={handleFormChange} required />
                                                {formError && <p style={{ color: 'red' }}>{formError}</p>}
                                                {formSuccess && <p style={{ color: 'green' }}>{formSuccess}</p>}
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                                <button type="submit" className="btn btn-primary">Add</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Edit Modal */}
                        {showEditModal && (
                            <div className="modal show d-block" tabIndex="-1">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Edit Admin</h5>
                                            <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                        </div>
                                        <form onSubmit={handleFormSubmit}>
                                            <div className="modal-body">
                                                <input className="form-control my-2" name="username" placeholder="Username" value={form.username} onChange={handleFormChange} required />
                                                <input className="form-control my-2" name="email" type="email" placeholder="Email" value={form.email} disabled />
                                                {formError && <p style={{ color: 'red' }}>{formError}</p>}
                                                {formSuccess && <p style={{ color: 'green' }}>{formSuccess}</p>}
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                                                <button type="submit" className="btn btn-primary">Save</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Admins; 