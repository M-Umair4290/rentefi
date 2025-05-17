import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styles from './login.module.css'
// import MyImage from '../assets/loginphoto.jpg'

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // // Current Credentials (Without Backend)
    // const validEmail = 'admin@rentefi.com';
    // const validPassword = '12345';

    const handleSubmit = (event) => {
        event.preventDefault();

        // Get stored user from localStorage
        const storedUser = JSON.parse(localStorage.getItem('registeredUser'));

        if (storedUser && storedUser.email === email && storedUser.password === password) {
            setError('');

            // Save current login session
            localStorage.setItem('user', JSON.stringify({ email }));

            // Navigate to dashboard
            navigate('/dashboard');
        } else {
            setError('Invalid email or password.');
        }
    };

    return (
        <>
            <div className='container-fluid'>
                <div className='row vh-100'>
                    <div className={`col-md-6  ${styles.logincover}`}>
                    </div>


                    <div className='col-6 d-flex align-items-center justify-content-evenly'>
                        <form className='d-flex flex-column justify-content-center' onSubmit={handleSubmit}>
                            <h1>Login</h1>
                            <p>Access to the Rentefi system</p>

                            <input className='mt-4 mb-2' type='email' name='email' size={40} placeholder='Email' value={email} required onChange={(event) => setEmail(event.target.value)}></input>

                            <input className='my-2' type='password' name='password' size={40} placeholder='Password' value={password} required onChange={(event) => setPassword(event.target.value)}></input>

                            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

                            <button type='submit' className='my-4'>Login</button>
                            <p className='text-center fs-6'>Don't have an account? <Link to="/signup">Signup now</Link></p>
                            <p className='text-center fs-6'><Link to="/">Back to Homepage</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login