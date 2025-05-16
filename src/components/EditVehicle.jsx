// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// function EditVehicle() {
//     const { id } = useParams(); // Get vehicle ID from URL params
//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         name: '',
//         modelYear: '',
//         numPlate: '',
//         fuelType: '',
//         seats: '',
//         transmission: '',
//         pricePerDay: '',
//         available: true,
//         carImage: '',
//     });

//     const [message, setMessage] = useState('');
//     const [error, setError] = useState('');

//     useEffect(() => {
//         // Declare the async function inside the effect
//         const fetchVehicleData = async () => {
//             try {
//                 // Make the API request
//                 const response = await axios.get(`https://car-backend-production.up.railway.app/api/cars/${id}`);
//                 // Set the form data with the response
//                 setFormData(response.data);
//             } catch (err) {
//                 // Handle errors properly
//                 console.error(err);
//                 setError('Failed to fetch vehicle data.');
//             }
//         };

//         // Call the async function
//         fetchVehicleData();
//     }, [id]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         setFormData(prev => ({
//             ...prev,
//             [name]: name === "available" ? value === "true" : value
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             // Update the vehicle details
//             const res = await axios.put(`https://car-backend-production.up.railway.app/api/cars/${id}`, formData);
//             setMessage('Vehicle updated successfully!');
//             setError('');
//             navigate('/vehicles'); // Navigate back to vehicles list after successful update
//         } catch (err) {
//             console.error(err);
//             setError('Failed to update vehicle.');
//             setMessage('');
//         }
//     };

//     return (
//         <div className="container">
//             <h2>Edit Vehicle</h2>
//             {message && <div className="alert alert-success">{message}</div>}
//             {error && <div className="alert alert-danger">{error}</div>}

//             <form onSubmit={handleSubmit}>
//                 <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
//                 <input type="text" name="modelYear" placeholder="Year" value={formData.modelYear} onChange={handleChange} required />
//                 <input type="text" name="numPlate" placeholder="Vehicle ID / Number Plate" value={formData.numPlate} onChange={handleChange} required />
//                 <input type="text" name="fuelType" placeholder="Type" value={formData.fuelType} onChange={handleChange} required />
//                 <input type="number" name="seats" placeholder="Seats" value={formData.seats} onChange={handleChange} required />
//                 <input type="text" name="transmission" placeholder="Transmission" value={formData.transmission} onChange={handleChange} required />
//                 <input type="number" name="pricePerDay" placeholder="Rate Per Day" value={formData.pricePerDay} onChange={handleChange} required />
//                 <input type="text" name="carImage" placeholder="Image URL" value={formData.carImage} onChange={handleChange} required />
//                 <select name="available" value={String(formData.available)} onChange={handleChange}>
//                     <option value="true">Available</option>
//                     <option value="false">Unavailable</option>
//                 </select>
//                 <button type="submit" className="btn btn-success mt-2">Update Vehicle</button>
//             </form>
//         </div>
//     );
// }

// export default EditVehicle;