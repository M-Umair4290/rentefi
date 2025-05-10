import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

function BookCar() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [form, setForm] = useState({
        pickupDate: '',
        returnDate: '',
        note: '',
    });

    // Debugging step
    console.log('Car ID:', id); // Check if `id` is coming through correctly

    useEffect(() => {
        axios.get(`https://car-backend-production.up.railway.app/api/cars/${id}`)
            .then(response => setCar(response.data))
            .catch(() => alert('Failed to load car info'));
    }, [id]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post('https://car-backend-production.up.railway.app/api/bookings', {
                carId: car._id,
                ...form,
                status: 'Pending',
            });
            alert('Booking request submitted!');
            navigate('/');
        } catch (err) {
            alert('Booking failed.');
        }
    };

    if (!car) return <div>Loading...</div>;

    return (
        <>
            <Navigation />
            <div className="container py-5">
                <h2>Book: {car.name}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Pickup Date</label>
                        <input type="date" className="form-control" name="pickupDate" required onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label>Return Date</label>
                        <input type="date" className="form-control" name="returnDate" required onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label>Note (Optional)</label>
                        <textarea className="form-control" name="note" onChange={handleChange}></textarea>
                    </div>
                    <button className="btn btn-primary" type="submit">Submit Booking</button>
                </form>
            </div>
            <Footer />
        </>
    );
}

export default BookCar;