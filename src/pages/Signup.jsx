import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styles from './login.module.css'
// import MyImage from '../assets/loginphoto.jpg'

function Signup() {

    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [cnic, setCnic] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Save to localStorage (NOT safe for production)
        const newUser = {
            fullName,
            cnic,
            mobile,
            email,
            password
        };

        localStorage.setItem('registeredUser', JSON.stringify(newUser));
        setError('');
        setSuccess('Signup successful! Redirecting to login...');

        setTimeout(() => {
            navigate('/login');
        }, 2000);
    };


    return (
        <>
            <div className='container-fluid'>
                <div className='row vh-100'>
                    <div className={`col-6  ${styles.logincover}`}>
                    </div>


                    <div className='col-6 d-flex align-items-center justify-content-evenly py-5'>
                        <form className='d-flex flex-column justify-content-center' onSubmit={handleSubmit}>
                            <h1>Signup</h1>
                            <p>Create your Rentefi account and join us today!</p>

                            <input className='my-2' type='text' name='fullname' size={40} placeholder='Full Name' value={fullName} required onChange={(event) => setFullName(event.target.value)}></input>

                            <input className='my-2' type='text' name='cnic' size={40} placeholder='CNIC Number (xxxxx-xxxxxxx-x)' pattern="\d{5}-\d{7}-\d{1}" value={cnic} required onChange={(event) => setCnic(event.target.value)}></input>

                            <input className='my-2' type='tel' name='mobile' size={40} placeholder='Mobile Number (03xx-xxxxxxx)' pattern="03\d{2}-\d{7}" value={mobile} required onChange={(event) => setMobile(event.target.value)}></input>

                            <input className='my-2' type='email' name='email' size={40} placeholder='Email' value={email} required onChange={(event) => setEmail(event.target.value)}></input>

                            <input className='my-2' type='password' name='password' size={40} placeholder='Password' value={password} required onChange={(event) => setPassword(event.target.value)}></input>

                            <input className='my-2' type='password' name='confirmpassword' size={40} placeholder='Confirm Password' value={confirmPassword} required onChange={(event) => setConfirmPassword(event.target.value)}></input>

                            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
                            {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}

                            <button type='submit' className='my-4'>Signup</button>
                            <p className='text-center fs-6'>Already have an account? <Link to="/login">Login</Link></p>
                            <p className='text-center fs-6'><Link to="/signup">Back to Homepage</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup