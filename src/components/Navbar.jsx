import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FaUserCircle } from "react-icons/fa";

function Navbar() {
    const navigate = useNavigate();

    // Check for accessToken to determine login state
    const accessToken = localStorage.getItem('accessToken');

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    return (
        <>
            <nav className='bg-dark text-light py-2 z-3'>
                <div className='container d-flex justify-content-between align-items-center'>
                    <div className='fs-4'><Link to="/" className='text-decoration-none text-light'>RENTEFI</Link></div>

                    <div className='dropdown'>
                        <button className='btn text-light dropdown-toggle d-flex align-items-center border-0 bg-dark' type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" aria-label="User menu">
                            <span><FaUserCircle size={25} /></span>
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                            {accessToken ? (
                                <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                            ) : (
                                <li><Link className="dropdown-item" to="/login">Login</Link></li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar