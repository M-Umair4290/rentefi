import React from 'react'
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUserCircle } from "react-icons/fa";

function Navbar() {
    return (
        <>
            <nav className='bg-dark text-light py-2 z-3'>
                <div className='container d-flex justify-content-between align-items-center'>
                    <div className='fs-4'><Link to="/" className='text-decoration-none text-light'>RENTEFI</Link></div>
                    <div><Link to="/login" className='text-decoration-none text-light'><FaUserCircle size={28} /></Link></div>
                </div>
            </nav>
        </>
    )
}

export default Navbar