import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

function Customers() {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [cars, setCars] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Form data for adding new customer booking
    const [addFormData, setAddFormData] = useState({
        carId: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        cnic: '',
        startDate: '',
        endDate: '',
        totalPrice: '',
        status: 'Pending',
        overtimeRate: '350/hr',
        tripType: 'inCity'
    });

    useEffect(() => {
        fetchCustomers();
        fetchCars();
    }, []);

    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('https://car-backend-production.up.railway.app/api/bookings');
            // Extract unique customers from bookings data
            const uniqueCustomers = response.data.reduce((acc, booking) => {
                const existingCustomer = acc.find(c => c.customerEmail === booking.customerEmail);
                if (!existingCustomer) {
                    acc.push({
                        id: booking._id,
                        name: booking.customerName,
                        email: booking.customerEmail,
                        phone: booking.customerPhone,
                        cnic: booking.cnic,
                        // Keep all booking data for editing
                        ...booking
                    });
                }
                return acc;
            }, []);
            setCustomers(uniqueCustomers);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching customers:', error);
            setError('Failed to load customers data.');
            setIsLoading(false);
        }
    };

    const fetchCars = async () => {
        try {
            const res = await axios.get('https://car-backend-production.up.railway.app/api/cars');
            setCars(res.data);
        } catch (error) {
            console.error('Error fetching cars:', error);
        }
    };

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setAddFormData(prev => {
            const newData = { ...prev, [name]: value };

            // Calculate total price when either car or dates change
            if (name === 'carId' || name === 'startDate' || name === 'endDate') {
                if (newData.carId && newData.startDate && newData.endDate) {
                    const selectedCar = cars.find(car => car._id === newData.carId);
                    if (selectedCar) {
                        const start = new Date(newData.startDate);
                        const end = new Date(newData.endDate);
                        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                        if (days > 0) {
                            newData.totalPrice = days * selectedCar.pricePerDay;
                        }
                    }
                }
            }
            return newData;
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingCustomer(prev => {
            const newData = { ...prev, [name]: value };

            // Calculate total price when either car or dates change
            if (name === 'carId' || name === 'startDate' || name === 'endDate') {
                if (newData.carId && newData.startDate && newData.endDate) {
                    const selectedCar = cars.find(car => car._id === newData.carId);
                    if (selectedCar) {
                        const start = new Date(newData.startDate);
                        const end = new Date(newData.endDate);
                        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                        if (days > 0) {
                            newData.totalPrice = days * selectedCar.pricePerDay;
                        }
                    }
                }
            }
            return newData;
        });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://car-backend-production.up.railway.app/api/bookings', addFormData);
            setMessage('Customer added successfully!');
            setError('');
            setShowAddModal(false);
            fetchCustomers();
            setAddFormData({
                carId: '',
                customerName: '',
                customerEmail: '',
                customerPhone: '',
                cnic: '',
                startDate: '',
                endDate: '',
                totalPrice: '',
                status: 'Pending',
                overtimeRate: '350/hr',
                tripType: 'inCity'
            });
        } catch (err) {
            console.error(err);
            setError('Failed to add customer.');
            setMessage('');
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://car-backend-production.up.railway.app/api/bookings/${editingCustomer._id}`, editingCustomer);
            setMessage('Customer updated successfully!');
            setError('');
            setEditingCustomer(null);
            fetchCustomers();
        } catch (err) {
            console.error(err);
            setError('Failed to update customer.');
            setMessage('');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer booking?')) {
            try {
                await axios.delete(`https://car-backend-production.up.railway.app/api/bookings/${id}`);
                setMessage('Customer deleted successfully!');
                fetchCustomers();
            } catch (err) {
                console.error(err);
                setError('Failed to delete customer.');
            }
        }
    };

    // Add filtered customers computation
    const filteredCustomers = customers.filter(customer => {
        const searchLower = searchTerm.toLowerCase();
        return (
            customer.name?.toLowerCase().includes(searchLower) ||
            customer.email?.toLowerCase().includes(searchLower) ||
            customer.phone?.toLowerCase().includes(searchLower) ||
            customer.cnic?.toLowerCase().includes(searchLower)
        );
    });

    const handleModalClick = (e) => {
        // Close modal if clicking outside the modal content
        if (e.target.classList.contains('modal-backdrop')) {
            setShowAddModal(false);
            setEditingCustomer(null);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container-fluid px-0 overflow-hidden">
                <div className="row">
                    <div className="col-3">
                        <Sidebar />
                    </div>

                    <div className="col-9 p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2>Customers</h2>
                            <div className="d-flex align-items-center gap-3">
                                <div className="search-box position-relative">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search customers..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ paddingLeft: '35px', minWidth: '250px' }}
                                    />
                                    <i className="fas fa-search position-absolute"
                                        style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }}></i>
                                </div>
                                <button
                                    className="btn btn-success rounded-circle d-flex align-items-center justify-content-center"
                                    onClick={() => setShowAddModal(true)}
                                    style={{ width: '40px', height: '40px' }}
                                >
                                    <i className="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>

                        {message && <div className="alert alert-success">{message}</div>}
                        {error && <div className="alert alert-danger">{error}</div>}

                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Customer Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>CNIC</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
                                            <div className="spinner-border text-primary me-2" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <span>Loading customers...</span>
                                        </td>
                                    </tr>
                                ) : filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            {searchTerm ? 'No matching customers found' : 'No customers found'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map(customer => (
                                        <tr key={customer.id}>
                                            <td>{customer.name}</td>
                                            <td>{customer.email}</td>
                                            <td>{customer.phone}</td>
                                            <td>{customer.cnic}</td>
                                            <td>
                                                <button className='btn btn-link text-primary p-0 me-2' onClick={() => setEditingCustomer(customer)}>
                                                    <i className="fas fa-pencil-alt"></i>
                                                </button>
                                                <button className='btn btn-link text-danger p-0' onClick={() => handleDelete(customer.id)}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {/* Add Customer Modal */}
                        {showAddModal && (
                            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Add New Customer</h5>
                                            <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                                        </div>
                                        <div className="modal-body">
                                            <form onSubmit={handleAddSubmit}>
                                                <div className="mb-3">
                                                    <select name="carId" className="form-control" onChange={handleAddChange} required>
                                                        <option value="">Select Car</option>
                                                        {cars.map(car => (
                                                            <option key={car._id} value={car._id}>{car.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="mb-3">
                                                    <input type="text" name="customerName" className="form-control" placeholder="Customer Name" onChange={handleAddChange} required />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="email" name="customerEmail" className="form-control" placeholder="Customer Email" onChange={handleAddChange} required />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="text" name="customerPhone" className="form-control" placeholder="Phone Number" onChange={handleAddChange} required />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="text" name="cnic" className="form-control" placeholder="CNIC" onChange={handleAddChange} required />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="date" name="startDate" className="form-control" onChange={handleAddChange} required />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="date" name="endDate" className="form-control" onChange={handleAddChange} required />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Total Price</label>
                                                    <input type="text" className="form-control" value={`${addFormData.totalPrice || 0} PKR`} disabled />
                                                </div>
                                                <button type="submit" className="btn btn-primary">Add Customer</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Edit Customer Modal */}
                        {editingCustomer && (
                            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Edit Customer</h5>
                                            <button type="button" className="btn-close" onClick={() => setEditingCustomer(null)}></button>
                                        </div>
                                        <div className="modal-body">
                                            <form onSubmit={handleEditSubmit}>
                                                <div className="mb-3">
                                                    <select name="carId" className="form-control" value={editingCustomer.carId} onChange={handleEditChange} required>
                                                        <option value="">Select Car</option>
                                                        {cars.map(car => (
                                                            <option key={car._id} value={car._id}>{car.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="mb-3">
                                                    <input type="text" name="customerName" className="form-control" placeholder="Customer Name" value={editingCustomer.name} onChange={handleEditChange} required />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="email" name="customerEmail" className="form-control" placeholder="Customer Email" value={editingCustomer.email} onChange={handleEditChange} required />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="text" name="customerPhone" className="form-control" placeholder="Phone Number" value={editingCustomer.phone} onChange={handleEditChange} required />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="text" name="cnic" className="form-control" placeholder="CNIC" value={editingCustomer.cnic} onChange={handleEditChange} required />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="date" name="startDate" className="form-control" value={editingCustomer.startDate?.split('T')[0]} onChange={handleEditChange} required />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="date" name="endDate" className="form-control" value={editingCustomer.endDate?.split('T')[0]} onChange={handleEditChange} required />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Total Price</label>
                                                    <input type="text" className="form-control" value={`${editingCustomer.totalPrice || 0} PKR`} disabled />
                                                </div>
                                                <div className="mb-3">
                                                    <select name="status" className="form-control" value={editingCustomer.status} onChange={handleEditChange}>
                                                        <option value="Pending">Pending</option>
                                                        <option value="Confirmed">Confirmed</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </div>
                                                <button type="submit" className="btn btn-primary">Update Customer</button>
                                            </form>
                                        </div>
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

export default Customers;