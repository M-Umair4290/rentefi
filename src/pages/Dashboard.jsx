import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

function Dashboard() {

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <>
            <Navbar />

            <div className="container-fluid px-0 overflow-hidden">
                <div className="row">
                    <div className="col-3">
                        <Sidebar />
                    </div>

                    <div className="col-9">

                    </div>
                </div>

            </div>

            <Footer />
        </>
    )
}

export default Dashboard