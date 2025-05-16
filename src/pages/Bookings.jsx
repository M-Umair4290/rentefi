import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

function Bookings() {

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const [bookings, setBookings] = useState([]);
    const [cars, setCars] = useState([]);

    // Fetch bookings and car details
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get('https://car-backend-production.up.railway.app/api/bookings'); // Replace with your actual endpoint
                setBookings(res.data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        const fetchCars = async () => {
            try {
                const res = await axios.get('https://car-backend-production.up.railway.app/api/cars'); // To resolve carId -> carName
                setCars(res.data);
            } catch (error) {
                console.error('Error fetching cars:', error);
            }
        };

        fetchBookings();
        fetchCars();
    }, []);

    // Helper to get car name by ID
    const getCarName = (id) => {
        const car = cars.find(car => car._id === id);
        return car ? car.name : 'Loading...';
    };

    const handleApprove = async (id) => {
        try {
            await axios.put(`https://car-backend-production.up.railway.app/api/bookings/${id}/approve`);
            setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'Approved' } : b));
        } catch (error) {
            console.error('Approval failed:', error);
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.put(`https://car-backend-production.up.railway.app/api/bookings/${id}/reject`);
            setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'Rejected' } : b));
        } catch (error) {
            console.error('Rejection failed:', error);
        }
    };

    // const [bookings, setBookings] = useState([]);

    // useEffect(() => {
    //     axios.get('/api/bookings') // Get all bookings data from API
    //         .then(response => setBookings(response.data))
    //         .catch(error => console.error(error));
    // }, []);

    // const handleStatusUpdate = (bookingId, newStatus) => {
    //     axios.put(`/api/bookings/${bookingId}`, { status: newStatus })
    //         .then(response => {
    //             // Update the booking status in the UI after success
    //             const updatedBookings = bookings.map(booking =>
    //                 booking._id === bookingId ? { ...booking, status: newStatus } : booking
    //             );
    //             setBookings(updatedBookings);
    //         })
    //         .catch(error => console.error(error));
    // };


    return (
        <>
            <Navbar />

            <div className="container-fluid px-0 overflow-hidden">
                <div className="row">
                    <div className="col-3">
                        <Sidebar />
                    </div>

                    <div className="col-9">
                        <h2 className="mb-4">Bookings</h2>
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
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(booking => (
                                    <tr key={booking._id}>
                                        <td>{getCarName(booking.carId)}</td>
                                        <td>{booking.customerName}</td>
                                        <td>{booking.customerPhone}</td>
                                        <td>{new Date(booking.startDate).toLocaleDateString()}</td>
                                        <td>{new Date(booking.endDate).toLocaleDateString()}</td>
                                        <td>{booking.totalPrice} PKR</td>
                                        <td>{booking.status}</td>
                                        <td>
                                            <button className="btn btn-success btn-sm me-1" onClick={() => handleApprove(booking._id)} disabled={booking.status.toLowerCase() !== 'pending'}>
                                                Approve
                                            </button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleReject(booking._id)} disabled={booking.status.toLowerCase() !== 'pending'}>
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>


                        {/* <div className="container">
                            <h3>Bookings List</h3>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Booking ID</th>
                                        <th>Customer</th>
                                        <th>Car Model</th>
                                        <th>Rental Dates</th>
                                        <th>Status</th>
                                        <th>Total Price</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(booking => (
                                        <tr key={booking._id}>
                                            <td>{booking.bookingId}</td>
                                            <td>{booking.customerName}</td>
                                            <td>{booking.carModel}</td>
                                            <td>{booking.startDate} - {booking.endDate}</td>
                                            <td>{booking.status}</td>
                                            <td>{booking.totalPrice}</td>
                                            <td>
                                                <button onClick={() => handleStatusUpdate(booking._id, 'Confirmed')}>Confirm</button>
                                                <button onClick={() => handleStatusUpdate(booking._id, 'Canceled')}>Cancel</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div> */}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Bookings