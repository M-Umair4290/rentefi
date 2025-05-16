// import React, { useState } from 'react';
// import axios from 'axios';

// function AddVehicle() {

//     const [formData, setFormData] = useState({
//         name: '',
//         modelYear: '',
//         brand: '',
//         numPlate: '',
//         category: '',
//         fuelType: '',
//         seats: '',
//         transmission: '',
//         pricePerDay: '',
//         available: true,
//         carImage: '', // Assuming this is a URL
//     });

//     const [message, setMessage] = useState('');
//     const [error, setError] = useState('');

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
//             console.log("Form data being submitted:", formData);
//             const res = await axios.post('https://car-backend-production.up.railway.app/api/cars', formData);
//             setMessage('Vehicle added successfully!');
//             setError('');
//         } catch (err) {
//             console.error(err);
//             setError('Failed to add vehicle.');
//             setMessage('');
//         }
//     };

//     return (
//         <>
//             <div className='container'>
//                 <h2>Add New Vehicle</h2>
//                 {message && <div className="alert alert-success">{message}</div>}
//                 {error && <div className="alert alert-danger">{error}</div>}

//                 <form onSubmit={handleSubmit}>
//                     <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
//                     <input type="text" name="modelYear" placeholder="Year" onChange={handleChange} required />
//                     <input type="text" name="brand" placeholder="Brand" onChange={handleChange} required />
//                     <input type="text" name="numPlate" placeholder="Vehicle ID / Number Plate" onChange={handleChange} required />
//                     <input type="text" name="category" placeholder="Category" onChange={handleChange} required />
//                     <input type="text" name="fuelType" placeholder="Type" onChange={handleChange} required />
//                     <input type="number" name="seats" placeholder="Seats" onChange={handleChange} required />
//                     <input type="text" name="transmission" placeholder="Transmission" onChange={handleChange} required />
//                     <input type="number" name="pricePerDay" placeholder="Rate Per Day" onChange={handleChange} required />
//                     <input type="text" name="carImage" placeholder="Image URL" onChange={handleChange} required />
//                     <select name="available" value={String(formData.available)} onChange={handleChange}>
//                         <option value="true">Available</option>
//                         <option value="false">Unavailable</option>
//                     </select>
//                     <button type="submit" className="btn btn-success mt-2">Add Vehicle</button>
//                 </form>
//             </div>
//         </>
//     )
// }

// export default AddVehicle