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
    const [bookingsData, setBookingsData] = useState([]);

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
            setBookingsData(response.data);

            // Extract unique customers based on any available identifier (CNIC, email, or phone)
            const uniqueCustomers = response.data.reduce((acc, booking) => {
                // Try to find existing customer by CNIC first, then email, then phone
                const existingCustomerIndex = acc.findIndex(c =>
                    (booking.cnic && c.cnic === booking.cnic) ||
                    (booking.customerEmail && c.customerEmail === booking.customerEmail) ||
                    (booking.customerPhone && c.customerPhone === booking.customerPhone)
                );

                if (existingCustomerIndex === -1) {
                    // Count all non-cancelled bookings for this customer using all possible identifiers
                    const bookingCount = response.data.filter(b => {
                        const isMatch = (booking.cnic && b.cnic === booking.cnic) ||
                            (booking.customerEmail && b.customerEmail === booking.customerEmail) ||
                            (booking.customerPhone && b.customerPhone === booking.customerPhone);
                        return isMatch && b.status.toLowerCase() !== 'cancelled';
                    }).length;

                    acc.push({
                        customerName: booking.customerName || 'N/A',
                        customerEmail: booking.customerEmail || 'N/A',
                        customerPhone: booking.customerPhone || 'N/A',
                        cnic: booking.cnic || 'N/A',
                        bookingCount: bookingCount,
                        // Store all identifiers to help with edit/delete operations
                        identifiers: {
                            cnic: booking.cnic,
                            email: booking.customerEmail,
                            phone: booking.customerPhone
                        }
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

        // Validation for required fields and formats
        const phoneRegex = /^[0-9]{4}-[0-9]{7}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]$/;

        if (!addFormData.customerPhone || !phoneRegex.test(addFormData.customerPhone)) {
            setError('Please enter a valid phone number (format: 0300-1234567)');
            return;
        }

        if (!addFormData.customerEmail || !emailRegex.test(addFormData.customerEmail)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!addFormData.cnic || !cnicRegex.test(addFormData.cnic)) {
            setError('Please enter a valid CNIC number (format: 12345-1234567-1)');
            return;
        }

        try {
            await axios.post('https://car-backend-production.up.railway.app/api/bookings', addFormData);
            setMessage('Customer booking added successfully!');
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
            setError('Failed to add customer booking.');
            setMessage('');
        }
    };

    const handleEditClick = (customer) => {
        // Find the latest booking for this customer from bookingsData
        const customerBookings = bookingsData.filter(booking =>
            (customer.identifiers.cnic && booking.cnic === customer.identifiers.cnic) ||
            (customer.identifiers.email && booking.customerEmail === customer.identifiers.email) ||
            (customer.identifiers.phone && booking.customerPhone === customer.identifiers.phone)
        );

        if (customerBookings.length > 0) {
            // Sort bookings by date to get the latest one
            const latestBooking = customerBookings.reduce((latest, current) => {
                return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
            }, customerBookings[0]);

            // Set the complete booking data for editing
            setEditingCustomer(latestBooking);
            setMessage('');
            setError('');
        } else {
            setError('No booking found for this customer.');
        }
    };

    const handleDelete = async (customer) => {
        if (window.confirm('Are you sure you want to delete this customer\'s booking?')) {
            try {
                // Find all bookings for this customer
                const customerBookings = bookingsData.filter(booking =>
                    (customer.identifiers.cnic && booking.cnic === customer.identifiers.cnic) ||
                    (customer.identifiers.email && booking.customerEmail === customer.identifiers.email) ||
                    (customer.identifiers.phone && booking.customerPhone === customer.identifiers.phone)
                );

                if (customerBookings.length > 0) {
                    // Delete the latest booking
                    const latestBooking = customerBookings.reduce((latest, current) => {
                        return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
                    }, customerBookings[0]);

                    await axios.delete(`https://car-backend-production.up.railway.app/api/bookings/${latestBooking._id}`);
                    setMessage('Customer booking deleted successfully!');
                    fetchCustomers();
                } else {
                    setError('No booking found for this customer.');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to delete customer booking.');
            }
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        // Validation for required fields and formats
        const phoneRegex = /^[0-9]{4}-[0-9]{7}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]$/;

        if (!editingCustomer.customerPhone || !phoneRegex.test(editingCustomer.customerPhone)) {
            setError('Please enter a valid phone number (format: 0300-1234567)');
            return;
        }

        if (!editingCustomer.customerEmail || !emailRegex.test(editingCustomer.customerEmail)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!editingCustomer.cnic || !cnicRegex.test(editingCustomer.cnic)) {
            setError('Please enter a valid CNIC number (format: 12345-1234567-1)');
            return;
        }

        try {
            await axios.put(`https://car-backend-production.up.railway.app/api/bookings/${editingCustomer._id}`, editingCustomer);
            setMessage('Customer booking updated successfully!');
            setError('');
            setEditingCustomer(null);
            fetchCustomers();
        } catch (err) {
            console.error(err);
            setError('Failed to update customer booking.');
            setMessage('');
        }
    };

    // Add filtered customers computation
    const filteredCustomers = customers.filter(customer => {
        const searchLower = searchTerm.toLowerCase();
        return (
            customer.customerName?.toLowerCase().includes(searchLower) ||
            customer.customerEmail?.toLowerCase().includes(searchLower) ||
            customer.customerPhone?.toLowerCase().includes(searchLower) ||
            customer.cnic?.toLowerCase().includes(searchLower)
        );
    });

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-warning';
            case 'Confirmed':
                return 'bg-success';
            case 'Cancelled':
                return 'bg-danger';
            default:
                return 'bg-secondary';
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
                                    <th>Total Bookings</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">
                                            <div className="spinner-border text-primary me-2" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <span>Loading customers...</span>
                                        </td>
                                    </tr>
                                ) : filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">
                                            {searchTerm ? 'No matching customers found' : 'No customers found'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map(customer => (
                                        <tr key={`${customer.identifiers.cnic || customer.identifiers.email || customer.identifiers.phone}`}>
                                            <td>{customer.customerName}</td>
                                            <td>
                                                {customer.customerEmail === 'N/A' ? (
                                                    <span className="text-danger">Missing</span>
                                                ) : (
                                                    customer.customerEmail
                                                )}
                                            </td>
                                            <td>
                                                {customer.customerPhone === 'N/A' ? (
                                                    <span className="text-danger">Missing</span>
                                                ) : (
                                                    customer.customerPhone
                                                )}
                                            </td>
                                            <td>
                                                {customer.cnic === 'N/A' ? (
                                                    <span className="text-danger">Missing</span>
                                                ) : (
                                                    customer.cnic
                                                )}
                                            </td>
                                            <td>
                                                <span className="badge bg-info">
                                                    {customer.bookingCount} bookings
                                                </span>
                                            </td>
                                            <td>
                                                <button className='btn btn-link text-primary p-0 me-2' onClick={() => handleEditClick(customer)}>
                                                    <i className="fas fa-pencil-alt"></i>
                                                </button>
                                                <button className='btn btn-link text-danger p-0' onClick={() => handleDelete(customer)}>
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
                                            <h5 className="modal-title">Add New Customer Booking</h5>
                                            <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                                        </div>
                                        <div className="modal-body">
                                            {message && <div className="alert alert-success">{message}</div>}
                                            {error && <div className="alert alert-danger">{error}</div>}
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
                                                    <input
                                                        type="text"
                                                        name="customerName"
                                                        className="form-control"
                                                        placeholder="Customer Name"
                                                        onChange={handleAddChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <input
                                                        type="email"
                                                        name="customerEmail"
                                                        className="form-control"
                                                        placeholder="Email (example@email.com)"
                                                        onChange={handleAddChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <input
                                                        type="text"
                                                        name="customerPhone"
                                                        className="form-control"
                                                        placeholder="Phone Number (0300-1234567)"
                                                        onChange={handleAddChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <input
                                                        type="text"
                                                        name="cnic"
                                                        className="form-control"
                                                        placeholder="CNIC (12345-1234567-1)"
                                                        onChange={handleAddChange}
                                                        required
                                                    />
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
                                                <button type="submit" className="btn btn-primary">Add Customer Booking</button>
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
                                            <h5 className="modal-title">Edit Customer Booking</h5>
                                            <button type="button" className="btn-close" onClick={() => setEditingCustomer(null)}></button>
                                        </div>
                                        <div className="modal-body">
                                            {message && <div className="alert alert-success">{message}</div>}
                                            {error && <div className="alert alert-danger">{error}</div>}
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
                                                    <input
                                                        type="text"
                                                        name="customerName"
                                                        className="form-control"
                                                        placeholder="Customer Name"
                                                        value={editingCustomer.customerName}
                                                        onChange={handleEditChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <input
                                                        type="email"
                                                        name="customerEmail"
                                                        className="form-control"
                                                        placeholder="Email (example@email.com)"
                                                        value={editingCustomer.customerEmail}
                                                        onChange={handleEditChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <input
                                                        type="text"
                                                        name="customerPhone"
                                                        className="form-control"
                                                        placeholder="Phone Number (0300-1234567)"
                                                        value={editingCustomer.customerPhone}
                                                        onChange={handleEditChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <input
                                                        type="text"
                                                        name="cnic"
                                                        className="form-control"
                                                        placeholder="CNIC (12345-1234567-1)"
                                                        value={editingCustomer.cnic}
                                                        onChange={handleEditChange}
                                                        required
                                                    />
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
                                                <button type="submit" className="btn btn-primary">Update Customer Booking</button>
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