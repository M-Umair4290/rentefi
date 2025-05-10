import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";


function Navigation() {
    const navigate = useNavigate();

    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch (e) {
        console.error('Failed to parse user from localStorage:', e);
    }

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand mx-5" to="/">RENTEFI</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/cars">Cars</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/about">About Us</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/contact">Contact Us</NavLink>
                        </li>
                    </ul>

                    <ul className="navbar-nav mx-5">
                        {user ? (
                            <li className="nav-item dropdown">
                                <button
                                    className="btn text-light dropdown-toggle d-flex align-items-center border-0 bg-dark"
                                    type="button"
                                    id="userDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <FaUserCircle size={24} className="me-1" />
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                    <li>
                                        <button className="dropdown-item text-danger" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/signup">Signup</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;
