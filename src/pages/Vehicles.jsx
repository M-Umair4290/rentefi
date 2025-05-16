import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';


function Vehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = () => {
        axios.get(`https://car-backend-production.up.railway.app/api/cars`)
            .then(res => setVehicles(res.data))
            .catch(err => {
                console.error(err);
                setError('Failed to load vehicles data.');
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

    // Handle input changes for Add Vehicle form
    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setAddFormData((prev) => ({
            ...prev,
            [name]: name === 'available' ? value === 'true' : value,
        }));
    };

    // Handle submission of Add Vehicle form
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://car-backend-production.up.railway.app/api/cars', addFormData);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingVehicle(prev => ({
            ...prev,
            [name]: name === "available" ? value === "true" : value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://car-backend-production.up.railway.app/api/cars/${editingVehicle._id}`, editingVehicle);
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

    return (
        <>
            <Navbar />
            <div className='container-fluid px-0 overflow-hidden text-center'>
                <div className="row">
                    <div className="col-3">
                        <Sidebar />
                    </div>

                    <div className='col-9 p-3 overflow-scroll'>
                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="d-flex justify-content-end mb-3">
                            <button className="btn btn-success" onClick={() => setShowAddModal(true)}>
                                + Add Vehicle
                            </button>
                        </div>

                        <table className='' >
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

                            <tbody>
                                {vehicles.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" className="text-center">No vehicles available</td>
                                    </tr>
                                ) : (
                                    vehicles.map(car => (
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
                                                <button className='btn btn-primary' onClick={() => handleEditClick(car)}>
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {/* Add Vehicle Modal */}
                        {showAddModal && (
                            <div style={modalOverlayStyle}>
                                <div style={modalStyle}>
                                    <h2>Add New Vehicle</h2>
                                    {addMessage && <div className="alert alert-success">{addMessage}</div>}
                                    {addError && <div className="alert alert-danger">{addError}</div>}

                                    <form onSubmit={handleAddSubmit}>
                                        <input type="text" name="name" placeholder="Name" onChange={handleAddChange} value={addFormData.name} required />
                                        <input type="text" name="modelYear" placeholder="Year" onChange={handleAddChange} value={addFormData.modelYear} required />
                                        <input type="text" name="brand" placeholder="Brand" onChange={handleAddChange} value={addFormData.brand} required />
                                        <input type="text" name="numPlate" placeholder="Vehicle ID / Number Plate" onChange={handleAddChange} value={addFormData.numPlate} required />
                                        <input type="text" name="category" placeholder="Category" onChange={handleAddChange} value={addFormData.category} required />
                                        <input type="text" name="fuelType" placeholder="Type" onChange={handleAddChange} value={addFormData.fuelType} required />
                                        <input type="number" name="seats" placeholder="Seats" onChange={handleAddChange} value={addFormData.seats} required />
                                        <input type="text" name="transmission" placeholder="Transmission" onChange={handleAddChange} value={addFormData.transmission} required />
                                        <input type="number" name="pricePerDay" placeholder="Rate Per Day" onChange={handleAddChange} value={addFormData.pricePerDay} required />
                                        <input type="text" name="carImage" placeholder="Image URL" onChange={handleAddChange} value={addFormData.carImage} required />
                                        <select name="available" className='my-3' value={String(addFormData.available)} onChange={handleAddChange}>
                                            <option value="true">Available</option>
                                            <option value="false">Unavailable</option>
                                        </select>

                                        <div style={{ marginTop: '1rem' }}>
                                            <button type="submit" className="btn btn-success me-2">
                                                Add Vehicle
                                            </button>
                                            <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Modal */}
                        {editingVehicle && (
                            <div
                                style={{
                                    position: 'fixed',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    zIndex: 1000,
                                }}
                            >
                                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '400px', position: 'relative' }}>
                                    <button onClick={handleCloseModal} style={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                        border: 'none',
                                        background: 'none',
                                        fontSize: '20px',
                                        color: 'black',
                                        cursor: 'pointer',
                                        width: '24px',       // restrict width
                                        height: '24px',      // restrict height
                                        lineHeight: '24px',  // center the × vertically
                                        textAlign: 'center',
                                        padding: 0,
                                        margin: 0,
                                    }}>×</button>
                                    <h2>Edit Vehicle</h2>
                                    {message && <div className="alert alert-success">{message}</div>}
                                    {editError && <div className="alert alert-danger">{editError}</div>}
                                    <form onSubmit={handleSubmit}>
                                        <input type="text" name="name" placeholder="Name" value={editingVehicle.name} onChange={handleChange} required />
                                        <input type="text" name="modelYear" placeholder="Year" value={editingVehicle.modelYear} onChange={handleChange} required />
                                        <input type="text" name="numPlate" placeholder="Vehicle ID / Number Plate" value={editingVehicle.numPlate} onChange={handleChange} required />
                                        <input type="text" name="fuelType" placeholder="Type" value={editingVehicle.fuelType} onChange={handleChange} required />
                                        <input type="number" name="seats" placeholder="Seats" value={editingVehicle.seats} onChange={handleChange} required />
                                        <input type="text" name="transmission" placeholder="Transmission" value={editingVehicle.transmission} onChange={handleChange} required />
                                        <input type="number" name="pricePerDay" placeholder="Rate Per Day" value={editingVehicle.pricePerDay} onChange={handleChange} required />
                                        <input type="text" name="carImage" placeholder="Image URL" value={editingVehicle.carImage} onChange={handleChange} required />
                                        <br />
                                        <select name="available" className='my-3' value={String(editingVehicle.available)} onChange={handleChange}>
                                            <option value="true">Available</option>
                                            <option value="false">Unavailable</option>
                                        </select>
                                        <br />
                                        <button type="submit" className="btn btn-success mt-2">Update Vehicle</button>
                                    </form>
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