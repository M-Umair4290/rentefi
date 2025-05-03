import React from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

function Vehicles() {

    const navigate = useNavigate;
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <>
            <Navbar />
            {/* <button onClick={handleLogout}>Logout</button> */}
            <Sidebar />
            <Footer />
        </>
    )
}

export default Vehicles