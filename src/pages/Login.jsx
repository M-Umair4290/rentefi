import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styles from './login.module.css'
import axios from 'axios';
// import MyImage from '../assets/loginphoto.jpg'

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // // Current Credentials (Without Backend)
    // const validEmail = 'admin@rentefi.com';
    // const validPassword = '12345';

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            const response = await axios.post('https://car-backend-b17f.onrender.com/api/user-login/login', {
                email: email.trim(),
                password: password.trim()
            });
            const { Accesstoken, RefreshToken } = response.data;
            localStorage.setItem('accessToken', Accesstoken);
            localStorage.setItem('refreshToken', RefreshToken);
            // Optionally store user info if returned
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || err.response?.data?.error || 'Invalid email or password.');
        }
    };

    return (
        <>
            <div className='container-fluid'>
                <div className='row vh-100'>
                    <div className={`col-12 col-md-6  ${styles.logincover}`}>
                    </div>

                    <div className='col-12 col-md-6 d-flex align-items-center justify-content-evenly py-5'>
                        <form className='w-100 px-4 d-flex flex-column justify-content-center' style={{ maxWidth: '400px' }} onSubmit={handleSubmit}>
                            <h1>Admin Login</h1>
                            <p>Access to the Rentefi admin dashboard</p>

                            <input
                                className='mt-4 mb-2'
                                type='email'
                                name='email'
                                size={40}
                                placeholder='Email'
                                value={email}
                                required
                                onChange={(event) => setEmail(event.target.value)}
                                autoComplete="email"
                            />

                            <input
                                className='my-2'
                                type='password'
                                name='password'
                                size={40}
                                placeholder='Password'
                                value={password}
                                required
                                onChange={(event) => setPassword(event.target.value)}
                                autoComplete="current-password"
                            />

                            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

                            <button type='submit' className='my-4'>Login</button>
                            <p className='text-center fs-6'>Need an admin account? <Link to="/signup">Create one</Link></p>
                            <p className='text-center fs-6'><Link to="/">Back to Homepage</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login