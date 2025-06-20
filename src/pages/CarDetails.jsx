import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import axios from 'axios';

function CarDetails() {
    const { id } = useParams(); // Extract the dynamic 'id' from the URL
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the car details using the extracted 'id'
        axios.get(`https://car-backend-b17f.onrender.com/api/cars/${id}`)
            .then(response => setCar(response.data))
            .catch(err => {
                console.error('Error fetching car details:', err);
                setError('Failed to load car details.');
            });
    }, [id]);

    const handleBookNow = () => {
        navigate(`/book/${car._id}`);
    };

    if (error) {
        return (
            <>
                <Navigation />
                <div className="container py-5">
                    <div className="alert alert-danger text-center">{error}</div>
                    <div className="text-center">
                        <button className="btn btn-secondary" onClick={() => navigate(-1)}>Go Back</button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (!car) {
        return (
            <>
                <Navigation />
                <div className="container py-5 text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navigation />

            <div className="container py-5 min-vh-100">
                <div className="row">
                    <div className="col-md-6">
                        <img
                            src={car.carImage}
                            alt={car.name}
                            className="img-fluid rounded"
                            style={{ maxHeight: '400px', objectFit: 'cover' }}
                        />
                    </div>
                    <div className="col-md-6">
                        <h2 className="mb-3">{car.name}</h2>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item"><strong>Model Year:</strong> {car.modelYear}</li>
                            <li className="list-group-item"><strong>Vehicle ID:</strong> {car.numPlate}</li>
                            <li className="list-group-item"><strong>Type:</strong> {car.fuelType}</li>
                            <li className="list-group-item"><strong>Seats:</strong> {car.seats}</li>
                            <li className="list-group-item"><strong>Transmission:</strong> {car.transmission}</li>
                            <li className="list-group-item"><strong>Rate Per Day:</strong> ${car.pricePerDay}</li>
                            <li className="list-group-item">
                                <strong>Status:</strong>
                                <span className={`badge ms-2 ${car.available ? 'bg-success' : 'bg-danger'}`}>
                                    {car.available ? 'Available' : 'Booked'}
                                </span>
                            </li>
                        </ul>

                        <div className="d-flex flex-column flex-sm-row gap-2 mt-5">
                            <button className="btn btn-primary" onClick={() => navigate(-1)}>Back to Cars</button>
                            {car.available && (
                                <button className="btn btn-success" onClick={handleBookNow}>
                                    Book Now
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default CarDetails