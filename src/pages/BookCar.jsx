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
        customerName: '',
        customerEmail: '',  // Changed from CustomerEmail to match API
        customerPhone: '',
        cnic: '',
        startDate: '',
        endDate: '',
        tripType: 'inCity',
        totalPrice: 0,  // Added as it's required by API
    });

    // Debugging step
    console.log('Car ID:', id);

    useEffect(() => {
        axios.get(`https://car-backend-b17f.onrender.com/api/cars/${id}`)
            .then(response => {
                setCar(response.data);
                // Set initial total price based on car's price
                setForm(prev => ({
                    ...prev,
                    totalPrice: response.data.price || 0
                }));
            })
            .catch(() => alert('Failed to load car info'));
    }, [id]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const start = new Date(form.startDate);
        const end = new Date(form.endDate);

        if (end <= start) {
            return alert("End date must be after start date.");
        }

        // Basic validation for required fields
        if (!form.customerName || !form.customerPhone || !form.customerEmail || !form.cnic || !form.startDate || !form.endDate || !form.tripType) {
            return alert("Please fill in all required fields.");
        }

        // Phone number validation (Pakistani format)
        const phoneRegex = /^[0-9]{4}-[0-9]{7}$/;
        if (!phoneRegex.test(form.customerPhone)) {
            return alert("Please enter a valid phone number (format: 0300-1234567)");
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.customerEmail)) {
            return alert("Please enter a valid email address.");
        }

        // CNIC validation (Pakistani format: 12345-1234567-1)
        const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
        if (!cnicRegex.test(form.cnic)) {
            return alert("Please enter a valid CNIC number (format: 12345-1234567-1)");
        }

        try {
            // Format dates to match API format
            const formattedData = {
                carId: car._id,
                ...form,
                startDate: new Date(form.startDate).toISOString(),
                endDate: new Date(form.endDate).toISOString(),
                status: 'pending',
                overtimeRate: car.overtimeRate || '350/hr',
            };

            console.log('Submitting booking data:', formattedData); // Debug log

            const response = await axios.post('https://car-backend-b17f.onrender.com/api/bookings', formattedData);
            console.log('Booking response:', response.data); // Debug log
            alert('Booking request submitted!');
            navigate('/');
        } catch (err) {
            console.error('Booking error:', err.response?.data || err.message); // Debug log
            alert('Booking failed: ' + (err.response?.data?.message || 'Please try again'));
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
                        <label>Customer Name *</label>
                        <input
                            type="text"
                            className="form-control"
                            name="customerName"
                            required
                            value={form.customerName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label>Phone Number * (Format: 0300-1234567)</label>
                        <input
                            type="tel"
                            className="form-control"
                            name="customerPhone"
                            placeholder="0300-1234567"
                            required
                            value={form.customerPhone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label>Email *</label>
                        <input
                            type="email"
                            className="form-control"
                            name="customerEmail"
                            placeholder="example@email.com"
                            required
                            value={form.customerEmail}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label>CNIC * (Format: 12345-1234567-1)</label>
                        <input
                            type="text"
                            className="form-control"
                            name="cnic"
                            placeholder="12345-1234567-1"
                            required
                            value={form.cnic}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label>Trip Type *</label>
                        <select
                            className="form-control"
                            name="tripType"
                            required
                            value={form.tripType}
                            onChange={handleChange}
                        >
                            <option value="inCity">In City</option>
                            <option value="outCity">Out City</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label>Start Date *</label>
                        <input
                            type="date"
                            className="form-control"
                            name="startDate"
                            required
                            value={form.startDate}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label>End Date *</label>
                        <input
                            type="date"
                            className="form-control"
                            name="endDate"
                            required
                            value={form.endDate}
                            onChange={handleChange}
                        />
                    </div>
                    <button className="btn btn-primary" type="submit">Submit Booking</button>
                </form>
            </div>
            <Footer />
        </>
    );
}

export default BookCar;