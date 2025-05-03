import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

function Vehicles() {

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const [vehicles, setVehicles] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`https://car-backend-production.up.railway.app/api/cars`)
            .then(res => setVehicles(res.data))
            .catch(err => {
                console.error(err);
                setError('Failed to load vehicles data.');
            });
    }, []);

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

                        <table className='' >
                            <thead>
                                <tr className='border p-2'>
                                    {/* <th className='border p-3'>ID</th> */}
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
                                    vehicles.map((car) => (
                                        <tr key={car._id}>
                                            {/* <td className='text-wrap'>
                                            {car._id}
                                        </td> */}

                                            <td>
                                                <img src={car.carImage} alt={`${car.name} Photo`} width={'100px'} />

                                                {/* <img src="https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?cs=srgb&dl=pexels-mikebirdy-170811.jpg&fm=jpg" alt="" width={'100px'} /> */}
                                            </td>

                                            <td>
                                                {car.name}
                                            </td>

                                            <td>
                                                {car.modelYear}
                                            </td>

                                            <td>
                                                {car.brand}
                                            </td>

                                            <td>
                                                {car.fuelType}
                                            </td>

                                            <td>
                                                {car.seats}
                                            </td>

                                            <td>
                                                {car.transmission}
                                            </td>

                                            <td>
                                                {car.pricePerDay}
                                            </td>

                                            <td>
                                                {car.available}
                                            </td>

                                            <td>
                                                <button className='btn btn-primary'>Edit</button>
                                            </td>
                                        </tr>
                                    ))
                                )}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Vehicles