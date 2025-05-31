import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

function Bookings() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [cars, setCars] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Form data for adding new booking
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
        fetchBookings();
        fetchCars();
    }, []);

    const checkExpiredBookings = async () => {
        try {
            const currentDate = new Date();

            // Filter confirmed bookings that have expired
            const expiredBookings = bookings.filter(booking =>
                booking.status === 'Confirmed' &&
                new Date(booking.endDate) < currentDate
            );

            // Update each expired booking and its associated car
            for (const booking of expiredBookings) {
                console.log(`Processing expired booking for car ${booking.carId}`);

                try {
                    // Extract the car ID properly whether it's an object or string
                    const carId = typeof booking.carId === 'object' ? booking.carId._id : booking.carId;

                    // Update car to available
                    await axios.put(`https://car-backend-production.up.railway.app/api/cars/${carId}`, {
                        available: true
                    });

                    // Update booking status to completed
                    await axios.put(`https://car-backend-production.up.railway.app/api/bookings/${booking._id}`, {
                        status: 'Completed'
                    });

                    console.log(`Updated car ${carId} to available and booking ${booking._id} to completed`);
                } catch (error) {
                    console.error(`Error updating expired booking ${booking._id}:`, error);
                }
            }

            // Refresh data if any updates were made
            if (expiredBookings.length > 0) {
                console.log(`Updated ${expiredBookings.length} expired bookings`);
                await fetchBookings();
                await fetchCars();
            }
        } catch (error) {
            console.error('Error checking expired bookings:', error);
        }
    };

    // Initial fetch of bookings and cars
    useEffect(() => {
        fetchBookings();
        fetchCars();
    }, []);

    // Separate useEffect for expired bookings check
    useEffect(() => {
        // Initial check
        checkExpiredBookings();

        // Set up interval for periodic checks
        const interval = setInterval(checkExpiredBookings, 60000); // Check every minute

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [bookings]); // Add bookings as dependency to ensure we're working with latest data

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('https://car-backend-production.up.railway.app/api/bookings');
            setBookings(res.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setError('Failed to load bookings.');
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

    const getCarName = (id) => {
        const car = cars.find(car => car._id === id);
        return car ? car.name : 'Loading...';
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
        setEditingBooking(prev => {
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
            setMessage('Booking added successfully!');
            setError('');
            setShowAddModal(false);
            fetchBookings();
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
            setError('Failed to add booking.');
            setMessage('');
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        // Validation for required fields and formats
        const phoneRegex = /^[0-9]{4}-[0-9]{7}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]$/;

        if (!editingBooking.customerPhone || !phoneRegex.test(editingBooking.customerPhone)) {
            setError('Please enter a valid phone number (format: 0300-1234567)');
            return;
        }

        if (!editingBooking.customerEmail || !emailRegex.test(editingBooking.customerEmail)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!editingBooking.cnic || !cnicRegex.test(editingBooking.cnic)) {
            setError('Please enter a valid CNIC number (format: 12345-1234567-1)');
            return;
        }

        try {
            // Update the booking
            await axios.put(`https://car-backend-production.up.railway.app/api/bookings/${editingBooking._id}`, editingBooking);

            // If the booking status is changed to Cancelled, update car availability
            if (editingBooking.status === 'Cancelled') {
                await axios.put(`https://car-backend-production.up.railway.app/api/cars/${editingBooking.carId}`, {
                    available: true
                });
            }

            setMessage('Booking updated successfully!');
            setError('');
            setEditingBooking(null);
            fetchBookings();
            fetchCars(); // Refresh cars list to show updated availability
        } catch (err) {
            console.error(err);
            setError('Failed to update booking.');
            setMessage('');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            try {
                await axios.delete(`https://car-backend-production.up.railway.app/api/bookings/${id}`);
                setMessage('Booking deleted successfully!');
                fetchBookings();
            } catch (err) {
                console.error(err);
                setError('Failed to delete booking.');
            }
        }
    };

    const handleApprove = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            // Get the booking details first
            const bookingResponse = await axios.get(`https://car-backend-production.up.railway.app/api/bookings/${id}`, config);
            const booking = bookingResponse.data;

            // Extract the car ID properly whether it's an object or string
            const carId = typeof booking.carId === 'object' ? booking.carId._id : booking.carId;
            console.log('Extracted Car ID:', carId);

            // Get the car details using the extracted ID
            const carResponse = await axios.get(`https://car-backend-production.up.railway.app/api/cars/${carId}`, config);
            const car = carResponse.data;

            // Update booking status
            await axios.put(
                `https://car-backend-production.up.railway.app/api/bookings/${id}`,
                { status: 'Confirmed' },
                config
            );

            // Update car using the extracted ID
            await axios.put(
                `https://car-backend-production.up.railway.app/api/cars/${carId}`,
                {
                    name: car.name,
                    brand: car.brand,
                    category: car.category || '',
                    modelYear: car.modelYear,
                    numPlate: car.numPlate,
                    pricePerDay: car.pricePerDay,
                    seats: car.seats,
                    fuelType: car.fuelType,
                    transmission: car.transmission,
                    carImage: car.carImage,
                    available: false
                },
                config
            );

            setMessage('Booking approved successfully!');
            await fetchBookings();
            await fetchCars();
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                carId: error.config?.url
            });
            setError(`Failed to approve booking: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.put(`https://car-backend-production.up.railway.app/api/bookings/${id}`, {
                status: 'Cancelled'
            });
            setMessage('Booking rejected successfully!');
            fetchBookings();
        } catch (error) {
            console.error('Rejection failed:', error);
            setError('Failed to reject booking.');
        }
    };

    const getStatusBadgeClass = (status) => {
        status = status.toLowerCase();
        if (status === 'pending') return 'bg-warning';
        if (status === 'confirmed') return 'bg-success';
        if (status === 'cancelled') return 'bg-danger';
        return 'bg-secondary';
    };

    // Add filtered bookings computation
    const filteredBookings = bookings.filter(booking => {
        const searchLower = searchTerm.toLowerCase();
        return (
            booking.customerName?.toLowerCase().includes(searchLower) ||
            booking.customerEmail?.toLowerCase().includes(searchLower) ||
            booking.customerPhone?.toLowerCase().includes(searchLower) ||
            booking.cnic?.toLowerCase().includes(searchLower) ||
            getCarName(booking.carId)?.toLowerCase().includes(searchLower) ||
            booking.status?.toLowerCase().includes(searchLower)
        );
    });

    const handleModalClick = (e) => {
        // Close modal if clicking outside the modal content
        if (e.target.classList.contains('modal-backdrop')) {
            setShowAddModal(false);
            setEditingBooking(null);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container-fluid px-0 overflow-hidden">
                <div className="row">
                    <div className="col-lg-3 col-md-4 col-sm-12">
                        <Sidebar />
                    </div>

                    <div className="col-lg-9 col-md-8 col-sm-12 p-5 overflow-scroll">
                        <div className="d-flex justify-content-between align-items-center mb-4 pb-5">
                            <h2>Bookings</h2>
                            <div className="d-flex align-items-center gap-3">
                                <div className="search-box position-relative">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search bookings..."
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
                                    <th>Car</th>
                                    <th>Customer</th>
                                    <th>Phone</th>
                                    <th>Pickup Date</th>
                                    <th>Return Date</th>
                                    <th>Total Price</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-4">
                                            <div className="spinner-border text-primary me-2" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <span>Loading bookings...</span>
                                        </td>
                                    </tr>
                                ) : filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            {searchTerm ? 'No matching bookings found' : 'No bookings found'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBookings.map(booking => (
                                        <tr key={booking._id}>
                                            <td>{getCarName(booking.carId)}</td>
                                            <td>{booking.customerName}</td>
                                            <td>{booking.customerPhone}</td>
                                            <td>{new Date(booking.startDate).toLocaleDateString()}</td>
                                            <td>{new Date(booking.endDate).toLocaleDateString()}</td>
                                            <td>{booking.totalPrice} PKR</td>
                                            <td>
                                                <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button className='btn btn-link text-primary p-0 me-2' onClick={() => setEditingBooking(booking)}>
                                                    <i className="fas fa-pencil-alt"></i>
                                                </button>
                                                <button className='btn btn-link text-danger p-0 me-2' onClick={() => handleDelete(booking._id)}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                                {booking.status.toLowerCase() === 'pending' && (
                                                    <>
                                                        <button className='btn btn-link text-success p-0 me-2' onClick={() => handleApprove(booking._id)}>
                                                            <i className="fas fa-check"></i>
                                                        </button>
                                                        <button className='btn btn-link text-danger p-0' onClick={() => handleReject(booking._id)}>
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {/* Add Booking Modal */}
                        {showAddModal && (
                            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Add New Booking</h5>
                                            <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                                        </div>
                                        <div className="modal-body">
                                            {message && <div className="alert alert-success">{message}</div>}
                                            {error && <div className="alert alert-danger">{error}</div>}
                                            <form onSubmit={handleAddSubmit}>
                                                <div className="mb-3">
                                                    <select name="carId" className="form-control" onChange={handleAddChange} required>
                                                        <option value="">Select Car</option>
                                                        {cars.filter(car => car.available).map(car => (
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
                                                <button type="submit" className="btn btn-primary">Add Booking</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Edit Booking Modal */}
                        {editingBooking && (
                            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Edit Booking</h5>
                                            <button type="button" className="btn-close" onClick={() => setEditingBooking(null)}></button>
                                        </div>
                                        <div className="modal-body">
                                            {message && <div className="alert alert-success">{message}</div>}
                                            {error && <div className="alert alert-danger">{error}</div>}
                                            <form onSubmit={handleEditSubmit}>
                                                <div className="mb-3">
                                                    <select name="carId" className="form-control" value={editingBooking.carId} onChange={handleEditChange} required>
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
                                                        value={editingBooking.customerName}
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
                                                        value={editingBooking.customerEmail}
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
                                                        value={editingBooking.customerPhone}
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
                                                        value={editingBooking.cnic}
                                                        onChange={handleEditChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="date" name="startDate" className="form-control" value={editingBooking.startDate?.split('T')[0]} onChange={handleEditChange} required />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="date" name="endDate" className="form-control" value={editingBooking.endDate?.split('T')[0]} onChange={handleEditChange} required />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Total Price</label>
                                                    <input type="text" className="form-control" value={`${editingBooking.totalPrice || 0} PKR`} disabled />
                                                </div>
                                                <div className="mb-3">
                                                    <select name="status" className="form-control" value={editingBooking.status} onChange={handleEditChange}>
                                                        <option value="Pending">Pending</option>
                                                        <option value="Confirmed">Confirmed</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                        <option value="Completed">Completed</option>
                                                    </select>
                                                </div>
                                                <button type="submit" className="btn btn-primary">Update Booking</button>
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

export default Bookings;