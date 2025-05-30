import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation';
import Footer from '../components/Footer'
import heroImage from '../assets/hero-cover.jpg'

function Home() {

    const navigate = useNavigate();

    const gotoLogin = () => {
        navigate('/login')
    }

    const gotoSignup = () => {
        navigate('/signup')
    }

    return (
        <>
            <Navigation />

            <div className="hero-section d-flex align-items-center justify-content-center text-center text-white"
                style={{
                    backgroundImage: `url(${heroImage})`, // Make sure this path is correct
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '90vh',
                    position: 'relative'
                }}></div>

            <div className="container py-5">
                <div className="text-center my-5">
                    <h1 className="display-5 fw-bold">
                        Who We Are
                    </h1>
                    <p className="lead mt-3">
                        Welcome to RENTEFI — a smart, reliable, and modern car rental solution, built using the MERN Stack with a clean Bootstrap UI. <strong>RENTEFI</strong> is a student-built full-stack car rental platform focused on simplifying the car rental experience.
                        We bridge the gap between renters and providers through a transparent, efficient, and user-centric solution.
                    </p>
                    <div className='lead mt-3'>
                        <div className='row'>
                            <div className="offset-md-3 col-md-6 d-flex">
                                <button className="btn btn-small text-white bg-primary px-2 mx-4" onClick={() => navigate('/cars')}>Book Now</button>
                                <button className="btn btn-small text-white bg-primary px-2 mx-4" onClick={() => navigate('/contact')}>Contact Us</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Home