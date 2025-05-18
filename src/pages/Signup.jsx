import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styles from './login.module.css'
// import MyImage from '../assets/loginphoto.jpg'

function Signup() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Trim whitespace from inputs
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();
        const trimmedConfirmPassword = confirmPassword.trim();

        if (!trimmedUsername || !trimmedPassword) {
            setError('Username and password are required.');
            return;
        }

        if (trimmedPassword !== trimmedConfirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            // Save to localStorage (NOT safe for production)
            const newAdmin = {
                username: trimmedUsername,
                password: trimmedPassword,
                role: 'admin'
            };

            console.log('Saving admin data:', newAdmin); // Debug log
            localStorage.setItem('adminUser', JSON.stringify(newAdmin));

            setError('');
            setSuccess('Admin signup successful! Redirecting to login...');

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            console.error('Signup error:', err);
            setError('An error occurred during signup. Please try again.');
        }
    };

    return (
        <>
            <div className='container-fluid'>
                <div className='row vh-100'>
                    <div className={`col-6 ${styles.logincover}`}>
                    </div>

                    <div className='col-6 d-flex align-items-center justify-content-evenly py-5'>
                        <form className='d-flex flex-column justify-content-center' onSubmit={handleSubmit}>
                            <h1>Admin Signup</h1>
                            <p>Create your admin account to manage Rentefi</p>

                            <input
                                className='my-2'
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
                                autoComplete="new-password"
                            />

                            <input
                                className='my-2'
                                type='password'
                                name='confirmpassword'
                                size={40}
                                placeholder='Confirm Password'
                                value={confirmPassword}
                                required
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                autoComplete="new-password"
                            />

                            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
                            {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}

                            <button type='submit' className='my-4'>Create Admin Account</button>
                            <p className='text-center fs-6'>Already have an account? <Link to="/login">Login</Link></p>
                            <p className='text-center fs-6'><Link to="/">Back to Homepage</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup