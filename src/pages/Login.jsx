import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styles from './login.module.css'
// import MyImage from '../assets/loginphoto.jpg'

function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // // Current Credentials (Without Backend)
    // const validEmail = 'admin@rentefi.com';
    // const validPassword = '12345';

    const handleSubmit = (event) => {
        event.preventDefault();

        try {
            // Get stored admin from localStorage
            const storedAdmin = localStorage.getItem('adminUser');
            console.log('Stored admin data:', storedAdmin); // Debug log

            if (!storedAdmin) {
                setError('No admin account found. Please sign up first.');
                return;
            }

            const adminData = JSON.parse(storedAdmin);
            console.log('Parsed admin data:', adminData); // Debug log
            console.log('Attempting login with:', { username, password }); // Debug log

            // Trim whitespace and ensure case-sensitive comparison
            const trimmedUsername = username.trim();
            const trimmedPassword = password.trim();

            console.log('Comparison:', {
                storedUsername: adminData.username,
                inputUsername: trimmedUsername,
                usernameMatch: adminData.username === trimmedUsername,
                passwordMatch: adminData.password === trimmedPassword
            });

            if (adminData.username === trimmedUsername && adminData.password === trimmedPassword) {
                console.log('Login successful!');
                setError('');

                // Save current login session with admin role
                const userData = {
                    username: trimmedUsername,
                    role: 'admin'
                };
                localStorage.setItem('currentUser', JSON.stringify(userData));
                console.log('User data saved:', userData);

                // Navigate to dashboard
                navigate('/dashboard');
            } else {
                console.log('Login failed - credentials do not match');
                setError('Invalid username or password.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred during login. Please try again.');
        }
    };

    return (
        <>
            <div className='container-fluid'>
                <div className='row vh-100'>
                    <div className={`col-12 col-md-6  ${styles.logincover}`}>
                    </div>

                    <div className='col-12 col-md-6 d-flex align-items-center justify-content-evenly'>
                        <form className='w-100 px-4 d-flex flex-column justify-content-center' style={{ maxWidth: '400px' }} onSubmit={handleSubmit}>
                            <h1>Admin Login</h1>
                            <p>Access to the Rentefi admin dashboard</p>

                            <input
                                className='mt-4 mb-2'
                                type='text'
                                name='username'
                                size={40}
                                placeholder='Username'
                                value={username}
                                required
                                onChange={(event) => setUsername(event.target.value)}
                                autoComplete="username"
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