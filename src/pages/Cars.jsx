import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

function Cars() {
    const [cars, setCars] = useState([]); // Initialize the cars state

    useEffect(() => {
        fetch('https://car-backend-production.up.railway.app/api/cars')
            .then(response => response.json())
            .then(data => setCars(data))
            .catch(error => console.error('Error fetching cars:', error));
    }, []);

    return (
        <>
            <Navigation />

            <div className="container py-5">
                <h2 className="text-center mb-5 display-4 text-dark">Available Cars</h2>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {/* Map through cars data */}
                    {cars.map(car => (
                        <div key={car._id} className="col">
                            <div className="card shadow-lg rounded-3 border-light overflow-hidden">
                                <img
                                    src={car.carImage}
                                    className="card-img-top object-cover"
                                    alt={car.name}
                                    style={{ height: '250px', objectFit: 'cover' }}
                                />
                                <div className="card-body p-4">
                                    <h5 className="card-title text-primary fw-bold">{car.name}</h5>
                                    <p className="card-text text-muted">Model Year: {car.modelYear}</p>
                                    <p className="card-text text-muted">Price per Day: ${car.pricePerDay}</p>
                                    <p className="card-text text-muted">Status: <span className={car.available ? 'text-muted' : 'text-danger'}>{car.available ? 'Available' : 'Booked'}</span></p>
                                    <Link
                                        to={`/cars/${car._id}`}
                                        className="btn btn-primary w-100 py-2 rounded-3 mt-3">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </>
    );
}

export default Cars;