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
                <h2 className="text-center mb-4">Available Cars</h2>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {/* Map through cars data */}
                    {cars.map(car => (
                        <div key={car._id} className="col">
                            <div className="card">
                                <img src={car.carImage} className="card-img-top" alt={car.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{car.name}</h5>
                                    <p className="card-text">Model Year: {car.modelYear}</p>
                                    <p className="card-text">Price per Day: {car.pricePerDay}</p>
                                    <Link to={`/cars/${car._id}`} className="btn btn-primary">View Details</Link>
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