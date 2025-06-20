import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Cloudinary } from '@cloudinary/url-gen';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';


function Vehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // For modal edit

    // --- Add Vehicle Modal State ---
    const [showAddModal, setShowAddModal] = useState(false);
    const [addFormData, setAddFormData] = useState({
        name: '',
        modelYear: '',
        brand: '',
        numPlate: '',
        category: '',
        fuelType: '',
        seats: '',
        transmission: '',
        pricePerDay: '',
        available: true,
        carImage: '',
    });
    const [addMessage, setAddMessage] = useState('');
    const [addError, setAddError] = useState('');

    // --- Edit Vehicle Modal State ---
    const [editingVehicle, setEditingVehicle] = useState(null);


    const [message, setMessage] = useState('');
    const [editError, setEditError] = useState('');

    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const checkExpiredBookings = async () => {
        try {
            // Get all bookings
            const bookingsResponse = await axios.get('https://car-backend-b17f.onrender.com/api/bookings');
            const bookings = bookingsResponse.data;
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
                    // Update car to available
                    await axios.put(`https://car-backend-b17f.onrender.com/api/cars/${booking.carId}`, {
                        available: true
                    });

                    // Update booking status to completed
                    await axios.put(`https://car-backend-b17f.onrender.com/api/bookings/${booking._id}`, {
                        status: 'Completed'
                    });

                    console.log(`Updated car ${booking.carId} to available and booking ${booking._id} to completed`);
                } catch (error) {
                    console.error(`Error updating expired booking ${booking._id}:`, error);
                }
            }

            // Refresh vehicles list if any updates were made
            if (expiredBookings.length > 0) {
                console.log(`Updated ${expiredBookings.length} expired bookings`);
                fetchVehicles();
            }
        } catch (error) {
            console.error('Error checking expired bookings:', error);
        }
    };

    // Check for expired bookings on component mount and every minute
    useEffect(() => {
        // Initial check
        checkExpiredBookings();

        // Set up interval for periodic checks
        const interval = setInterval(checkExpiredBookings, 60000); // Check every minute

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    const fetchVehicles = () => {
        setIsLoading(true);
        axios.get(`https://car-backend-b17f.onrender.com/api/cars`)
            .then(res => {
                setVehicles(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to load vehicles data.');
                setIsLoading(false);
            });
    };

    const handleEditClick = (vehicle) => {
        setEditingVehicle(vehicle);  // Open modal with vehicle data
        setMessage('');
        setEditError('');
    };

    const handleCloseModal = () => {
        setEditingVehicle(null);
    };

    const handleImageUpload = async (file) => {
        try {
            setUploadingImage(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'rentefi_app');

            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/dxssblapo/image/upload',
                formData
            );

            return response.data.secure_url;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error('Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleAddChange = async (e) => {
        const { name, value, files } = e.target;

        if (name === 'carImage' && files?.length > 0) {
            try {
                const imageUrl = await handleImageUpload(files[0]);
                setAddFormData(prev => ({
                    ...prev,
                    carImage: imageUrl
                }));
            } catch (error) {
                setAddError('Failed to upload image. Please try again.');
            }
            return;
        }

        setAddFormData(prev => ({
            ...prev,
            [name]: name === "available" ? value === "true" : value
        }));
    };

    const handleChange = async (e) => {
        const { name, value, files } = e.target;

        if (name === 'carImage' && files?.length > 0) {
            try {
                const imageUrl = await handleImageUpload(files[0]);
                setEditingVehicle(prev => ({
                    ...prev,
                    carImage: imageUrl
                }));
            } catch (error) {
                setEditError('Failed to upload image. Please try again.');
            }
            return;
        }

        setEditingVehicle(prev => ({
            ...prev,
            [name]: name === "available" ? value === "true" : value
        }));
    };

    // Handle submission of Add Vehicle form
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://car-backend-b17f.onrender.com/api/cars', addFormData);
            setAddMessage('Vehicle added successfully!');
            setAddError('');
            setShowAddModal(false);
            fetchVehicles(); // Refresh list
            // Reset form data
            setAddFormData({
                name: '',
                modelYear: '',
                brand: '',
                numPlate: '',
                category: '',
                fuelType: '',
                seats: '',
                transmission: '',
                pricePerDay: '',
                available: true,
                carImage: '',
            });
        } catch (err) {
            console.error(err);
            setAddError('Failed to add vehicle.');
            setAddMessage('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://car-backend-b17f.onrender.com/api/cars/${editingVehicle._id}`, editingVehicle);
            setMessage('Vehicle updated successfully!');
            setEditError('');
            fetchVehicles();   // Refresh list
            setEditingVehicle(null); // Close modal
        } catch (err) {
            console.error(err);
            setEditError('Failed to update vehicle.');
            setMessage('');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            try {
                await axios.delete(`https://car-backend-b17f.onrender.com/api/cars/${id}`);
                fetchVehicles(); // Refresh list
                setMessage('Vehicle deleted successfully!');
            } catch (err) {
                console.error(err);
                setError('Failed to delete vehicle.');
            }
        }
    };

    // Add filtered vehicles computation
    const filteredVehicles = vehicles.filter(car => {
        const searchLower = searchTerm.toLowerCase();
        return (
            car.name?.toLowerCase().includes(searchLower) ||
            car.brand?.toLowerCase().includes(searchLower) ||
            car.numPlate?.toLowerCase().includes(searchLower) ||
            car.category?.toLowerCase().includes(searchLower) ||
            car.fuelType?.toLowerCase().includes(searchLower) ||
            car.transmission?.toLowerCase().includes(searchLower)
        );
    });

    const handleModalClick = (e) => {
        // Close modal if clicking outside the modal content
        if (e.target.classList.contains('modal-backdrop')) {
            setShowAddModal(false);
            setEditingVehicle(null);
        }
    };

    return (
        <>
            <Navbar />
            <div className='container-fluid px-0 overflow-hidden text-center'>
                <div className="row">
                    <div className="col-lg-3 col-md-4 col-sm-12">
                        <Sidebar />
                    </div>

                    <div className='col-lg-9 col-md-8 col-sm-12 p-3 overflow-scroll'>
                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2>Vehicles</h2>
                            <div className="d-flex align-items-center gap-3">
                                <div className="search-box position-relative">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search vehicles..."
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

                        <table className='table table-bordered' >
                            <thead>
                                <tr className='border p-2'>
                                    <th className='border p-3'>Image</th>
                                    <th className='border p-3'>Name</th>
                                    <th className='border p-3'>Year</th>
                                    <th className='border p-3'>Vehicle ID</th>
                                    <th className='border p-3'>Type</th>
                                    <th className='border p-3'>Seats</th>
                                    <th className='border p-3'>Transmission</th>
                                    <th className='border p-3'>Rate Per Day</th>
                                    <th className='border p-3'>Status</th>
                                    <th className='border p-3'>Actions</th>
                                </tr>
                            </thead>

                            <tbody className='border'>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="10" className="text-center py-4">
                                            <div className="spinner-border text-primary me-2" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <span>Loading vehicles...</span>
                                        </td>
                                    </tr>
                                ) : filteredVehicles.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" className="text-center">
                                            {searchTerm ? 'No matching vehicles found' : 'No vehicles available'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredVehicles.map(car => (
                                        <tr key={car._id}>
                                            <td><img src={car.carImage} alt={`${car.name} Photo`} width={'100px'} /></td>
                                            <td>{car.name}</td>
                                            <td>{car.modelYear}</td>
                                            <td>{car.numPlate}</td>
                                            <td>{car.fuelType}</td>
                                            <td>{car.seats}</td>
                                            <td>{car.transmission}</td>
                                            <td>{car.pricePerDay}</td>
                                            <td>
                                                <span className={`badge ${car.available ? 'bg-success' : 'bg-danger'}`}>
                                                    {car.available ? 'Available' : 'Booked'}
                                                </span>
                                            </td>
                                            <td>
                                                <button className='btn btn-link text-primary p-0' onClick={() => handleEditClick(car)}>
                                                    <i className="fas fa-pencil-alt"></i>
                                                </button>
                                                <button className='btn btn-link text-danger p-0' onClick={() => handleDelete(car._id)}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {/* Add Vehicle Modal */}
                        {showAddModal && (
                            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Add New Vehicle</h5>
                                            <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                                        </div>
                                        <div className="modal-body">
                                            {addMessage && <div className="alert alert-success">{addMessage}</div>}
                                            {addError && <div className="alert alert-danger">{addError}</div>}
                                            <form onSubmit={handleAddSubmit}>
                                                <div className="mb-3">
                                                    <input type="text" name="name" className="form-control" placeholder="Name" onChange={handleAddChange} value={addFormData.name} required />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="text" name="modelYear" className="form-control" placeholder="Year" onChange={handleAddChange} value={addFormData.modelYear} required />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="text" name="brand" className="form-control" placeholder="Brand" onChange={handleAddChange} value={addFormData.brand} required />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="text" name="numPlate" className="form-control" placeholder="Vehicle ID / Number Plate" onChange={handleAddChange} value={addFormData.numPlate} required />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="text" name="category" className="form-control" placeholder="Category" onChange={handleAddChange} value={addFormData.category} required />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="text" name="fuelType" className="form-control" placeholder="Type" onChange={handleAddChange} value={addFormData.fuelType} required />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="number" name="seats" className="form-control" placeholder="Seats" onChange={handleAddChange} value={addFormData.seats} required />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="text" name="transmission" className="form-control" placeholder="Transmission" onChange={handleAddChange} value={addFormData.transmission} required />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="number" name="pricePerDay" className="form-control" placeholder="Rate Per Day" onChange={handleAddChange} value={addFormData.pricePerDay} required />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Vehicle Image</label>
                                                    <input
                                                        type="file"
                                                        name="carImage"
                                                        className="form-control"
                                                        accept="image/*"
                                                        onChange={handleAddChange}
                                                        required
                                                    />
                                                    {uploadingImage && <div className="text-muted mt-2">Uploading image...</div>}
                                                    {addFormData.carImage && (
                                                        <div className="mt-2">
                                                            <img
                                                                src={addFormData.carImage}
                                                                alt="Vehicle preview"
                                                                style={{ maxWidth: '200px', maxHeight: '150px' }}
                                                                className="img-thumbnail"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mb-3">
                                                    <select name="available" className="form-control" value={String(addFormData.available)} onChange={handleAddChange}>
                                                        <option value="true">Available</option>
                                                        <option value="false">Unavailable</option>
                                                    </select>
                                                </div>
                                                <button type="submit" className="btn btn-primary" disabled={uploadingImage}>
                                                    {uploadingImage ? 'Uploading...' : 'Add Vehicle'}
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Edit Vehicle Modal */}
                        {editingVehicle && (
                            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Edit Vehicle</h5>
                                            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                                        </div>
                                        <div className="modal-body">
                                            {message && <div className="alert alert-success">{message}</div>}
                                            {editError && <div className="alert alert-danger">{editError}</div>}
                                            <form onSubmit={handleSubmit}>
                                                <div className="mb-3">
                                                    <input type="text" name="name" className="form-control" placeholder="Name" value={editingVehicle.name} onChange={handleChange} required />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="text" name="modelYear" className="form-control" placeholder="Year" value={editingVehicle.modelYear} onChange={handleChange} required />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="text" name="numPlate" className="form-control" placeholder="Vehicle ID / Number Plate" value={editingVehicle.numPlate} onChange={handleChange} required />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="text" name="fuelType" className="form-control" placeholder="Type" value={editingVehicle.fuelType} onChange={handleChange} required />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="number" name="seats" className="form-control" placeholder="Seats" value={editingVehicle.seats} onChange={handleChange} required />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="text" name="transmission" className="form-control" placeholder="Transmission" value={editingVehicle.transmission} onChange={handleChange} required />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="number" name="pricePerDay" className="form-control" placeholder="Rate Per Day" value={editingVehicle.pricePerDay} onChange={handleChange} required />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Vehicle Image</label>
                                                    <input
                                                        type="file"
                                                        name="carImage"
                                                        className="form-control"
                                                        accept="image/*"
                                                        onChange={handleChange}
                                                    />
                                                    {uploadingImage && <div className="text-muted mt-2">Uploading image...</div>}
                                                    {editingVehicle.carImage && (
                                                        <div className="mt-2">
                                                            <img
                                                                src={editingVehicle.carImage}
                                                                alt="Vehicle preview"
                                                                style={{ maxWidth: '200px', maxHeight: '150px' }}
                                                                className="img-thumbnail"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mb-3">
                                                    <select name="available" className="form-control" value={String(editingVehicle.available)} onChange={handleChange}>
                                                        <option value="true">Available</option>
                                                        <option value="false">Unavailable</option>
                                                    </select>
                                                </div>
                                                <button type="submit" className="btn btn-primary" disabled={uploadingImage}>
                                                    {uploadingImage ? 'Uploading...' : 'Update Vehicle'}
                                                </button>
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


// --- Inline styles for modal overlay & box ---
const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
};

const modalStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto',
};

export default Vehicles;