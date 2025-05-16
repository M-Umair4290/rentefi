import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


function Dashboard() {

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };


    const [stats, setStats] = useState({
        totalCustomers: 0,
        totalBookings: 0,
        totalRevenue: 0,
    });

    const [bookingTrends, setBookingTrends] = useState([]);

    useEffect(() => {
        axios.get('/api/dashboard-stats')
            .then(response => {
                setStats(response.data.stats);
                setBookingTrends(response.data.bookingTrends);
            })
            .catch(error => console.error(error));

        // Cleanup chart when component unmounts or data changes
        return () => {
            if (window.myChart) {
                window.myChart.destroy();
            }
        };
    }, []);

    const chartData = {
        labels: bookingTrends.map(item => item.date),
        datasets: [{
            label: 'Bookings Over Time',
            data: bookingTrends.map(item => item.bookings),
            borderColor: 'rgba(75,192,192,1)',
            fill: false,
        }],
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
                        <div className="container">
                            <h3>Admin Dashboard</h3>
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5>Total Customers</h5>
                                            <p>{stats.totalCustomers}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5>Total Bookings</h5>
                                            <p>{stats.totalBookings}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5>Total Revenue</h5>
                                            <p>${stats.totalRevenue}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col-md-12">
                                    <h5>Bookings Trend</h5>
                                    {bookingTrends.length > 0 ? (
                                        <Line data={chartData} />
                                    ) : (
                                        <p>No booking trend data available.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <Footer />
        </>
    )
}

export default Dashboard