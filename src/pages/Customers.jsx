import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

function Customers() {

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };


    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        axios.get('https://car-backend-production.up.railway.app/api/bookings') // Get customers data from the API
            .then(response => setCustomers(response.data))
            .catch(error => console.error(error));
    }, []);


    const handleEdit = (id) => {
        navigate(`/edit-customer/${id}`);
    };


    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            axios.delete(`https://car-backend-production.up.railway.app/api/bookings/${id}`)
                .then(() => {
                    // Remove deleted customer from state so UI updates immediately
                    setCustomers(customers.filter(customer => customer._id !== id));
                })
                .catch(error => console.error('Delete error:', error));
        }
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
                            <h3>Customer List</h3>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        {/* <th>Email</th> */}
                                        <th>Phone</th>
                                        <th>Status</th>
                                        <th>Bookings</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map(customer => (
                                        <tr key={customer._id}>
                                            <td>{customer.customerName}</td>
                                            {/* <td>{customer.email}</td> */}
                                            <td>{customer.customerPhone}</td>
                                            <td>{customer.status}</td>
                                            <td>{customer.bookings}</td>
                                            <td>
                                                <button className='btn btn-primary my-1' onClick={() => handleEdit(customer._id)}>Edit</button>

                                                <button className='btn btn-primary my-1' onClick={() => handleDelete(customer._id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>

            <Footer />
        </>
    )
}

export default Customers