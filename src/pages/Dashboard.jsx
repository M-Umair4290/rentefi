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
        localStorage.removeItem('currentUser');
        navigate('/login');
    };

    const [stats, setStats] = useState({
        totalCustomers: 0,
        totalBookings: 0,
        totalRevenue: 0,
        totalVehicles: 0
    });

    const [bookingTrends, setBookingTrends] = useState([]);
    const [revenueTrends, setRevenueTrends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper function to format date as DD/MM
    const formatDateShort = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${day}/${month}`;
    };

    // Helper function to get last 4 weeks
    const getLast4Weeks = () => {
        const weeks = [];
        const today = new Date();

        for (let i = 3; i >= 0; i--) {
            const endDate = new Date(today);
            endDate.setDate(today.getDate() - (i * 7));
            const startDate = new Date(endDate);
            startDate.setDate(endDate.getDate() - 6);

            weeks.push({
                startDate,
                endDate,
                label: `${formatDateShort(startDate)} - ${formatDateShort(endDate)}`
            });
        }
        return weeks;
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch bookings and cars data
                const [bookingsResponse, carsResponse] = await Promise.all([
                    axios.get('https://car-backend-b17f.onrender.com/api/bookings'),
                    axios.get('https://car-backend-b17f.onrender.com/api/cars')
                ]);

                const bookings = bookingsResponse.data;
                const cars = carsResponse.data;

                // Get unique customers using phone and name combination
                const uniqueCustomers = new Set(
                    bookings.map(booking => `${booking.customerPhone}_${booking.customerName.toLowerCase()}`)
                ).size;

                // Debug log for all bookings
                console.log('All bookings:', bookings.map(b => ({
                    id: b._id,
                    status: b.status,
                    price: b.totalPrice,
                    customer: b.customerName,
                    phone: b.customerPhone
                })));

                // Calculate total revenue from confirmed and completed bookings only
                const revenueBookings = bookings.filter(booking =>
                    booking.status && (booking.status.toLowerCase() === 'confirmed' || booking.status.toLowerCase() === 'completed')
                );

                console.log('Revenue bookings:', revenueBookings.map(b => ({
                    id: b._id,
                    price: b.totalPrice,
                    customer: b.customerName,
                    status: b.status
                })));

                const totalRevenue = revenueBookings.reduce((sum, booking) => {
                    // Convert price to number, handling string values
                    const price = typeof booking.totalPrice === 'string'
                        ? parseFloat(booking.totalPrice.replace(/[^0-9.-]+/g, ''))
                        : Number(booking.totalPrice) || 0;
                    return sum + price;
                }, 0);

                console.log('Final calculated revenue:', totalRevenue);

                // Get last 4 weeks
                const last4Weeks = getLast4Weeks();
                const weeklyBookings = {};
                const weeklyRevenue = {};

                // Initialize all weeks with 0
                last4Weeks.forEach(week => {
                    weeklyBookings[week.label] = 0;
                    weeklyRevenue[week.label] = 0;
                });

                // Process bookings and revenue by week
                bookings.forEach(booking => {
                    const bookingDate = new Date(booking.createdAt);
                    const matchingWeek = last4Weeks.find(week =>
                        bookingDate >= week.startDate && bookingDate <= week.endDate
                    );
                    if (matchingWeek) {
                        weeklyBookings[matchingWeek.label]++;
                        // Only add to revenue if booking is confirmed or completed
                        if (booking.status && (booking.status.toLowerCase() === 'confirmed' || booking.status.toLowerCase() === 'completed')) {
                            const price = typeof booking.totalPrice === 'string'
                                ? parseFloat(booking.totalPrice.replace(/[^0-9.-]+/g, ''))
                                : Number(booking.totalPrice) || 0;
                            weeklyRevenue[matchingWeek.label] += price;
                        }
                    }
                });

                // Convert to arrays maintaining the order
                const bookingTrendData = last4Weeks.map(week => ({
                    date: week.label,
                    bookings: weeklyBookings[week.label] || 0
                }));

                const revenueTrendData = last4Weeks.map(week => ({
                    date: week.label,
                    revenue: weeklyRevenue[week.label] || 0
                }));

                setStats({
                    totalCustomers: uniqueCustomers,
                    totalBookings: bookings.length,
                    totalRevenue: totalRevenue,
                    totalVehicles: cars.length
                });

                setBookingTrends(bookingTrendData);
                setRevenueTrends(revenueTrendData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const bookingChartData = {
        labels: bookingTrends.map(item => item.date),
        datasets: [{
            label: 'Bookings Per Week',
            data: bookingTrends.map(item => item.bookings),
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: 'rgba(75,192,192,1)',
        }],
    };

    const revenueChartData = {
        labels: revenueTrends.map(item => item.date),
        datasets: [{
            label: 'Weekly Revenue',
            data: revenueTrends.map(item => item.revenue),
            borderColor: 'rgba(255,159,64,1)',
            backgroundColor: 'rgba(255,159,64,0.2)',
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: 'rgba(255,159,64,1)',
        }],
    };

    const bookingChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Weekly Booking Trends (Last 30 Days)'
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `Weekly Bookings: ${context.raw}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    drawOnChartArea: true,
                    drawTicks: true,
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    maxRotation: 0,
                    minRotation: 0
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    drawOnChartArea: true,
                    drawTicks: true,
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    stepSize: 1
                }
            }
        },
        elements: {
            point: {
                radius: 6,
                hoverRadius: 8,
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'white',
                borderWidth: 2
            },
            line: {
                tension: 0.4
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    const revenueChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Weekly Revenue Trends (Last 30 Days)'
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `Weekly Revenue: Rs. ${context.raw.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    drawOnChartArea: true,
                    drawTicks: true,
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    maxRotation: 0,
                    minRotation: 0
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    drawOnChartArea: true,
                    drawTicks: true,
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    callback: function (value) {
                        return 'Rs. ' + value.toLocaleString();
                    }
                }
            }
        },
        elements: {
            point: {
                radius: 6,
                hoverRadius: 8,
                backgroundColor: 'rgba(255,159,64,1)',
                borderColor: 'white',
                borderWidth: 2
            },
            line: {
                tension: 0.4
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="alert alert-danger m-3" role="alert">
            {error}
        </div>
    );

    return (
        <>
            <Navbar />
            <div className="container-fluid px-0 overflow-hidden">
                <div className="row">
                    <div className="col-lg-3 col-md-4 col-sm-12">
                        <Sidebar />
                    </div>

                    <div className="col-lg-9 col-md-8 col-sm-12 overflow-scroll">
                        <div className="container py-4">
                            <h3 className="mb-4">Admin Dashboard</h3>
                            <div className="row g-4">
                                <div className="col-md-3">
                                    <div className="card bg-primary text-white">
                                        <div className="card-body">
                                            <h5 className="card-title">Total Customers</h5>
                                            <h2 className="card-text">{stats.totalCustomers}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card bg-success text-white">
                                        <div className="card-body">
                                            <h5 className="card-title">Total Bookings</h5>
                                            <h2 className="card-text">{stats.totalBookings}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card bg-info text-white">
                                        <div className="card-body">
                                            <h5 className="card-title">Total Revenue</h5>
                                            <h2 className="card-text">Rs. {stats.totalRevenue.toLocaleString()}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card bg-warning text-white">
                                        <div className="card-body">
                                            <h5 className="card-title">Total Vehicles</h5>
                                            <h2 className="card-text">{stats.totalVehicles}</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col-12 mb-4">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">Booking Trends</h5>
                                            {bookingTrends.length > 0 ? (
                                                <Line data={bookingChartData} options={bookingChartOptions} />
                                            ) : (
                                                <p className="text-center text-muted my-4">No booking trend data available.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">Revenue Trends</h5>
                                            {revenueTrends.length > 0 ? (
                                                <Line data={revenueChartData} options={revenueChartOptions} />
                                            ) : (
                                                <p className="text-center text-muted my-4">No revenue trend data available.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Dashboard;