import React from 'react'
import { useNavigate } from 'react-router-dom'
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

            <Footer />
        </>
    )
}

export default Home