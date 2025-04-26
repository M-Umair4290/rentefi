import React from 'react'
// import MyImage from '../assets/loginphoto.jpg'
import styles from './login.module.css'

function Login() {
    return (
        <>
            <div className='container-fluid'>
                <div className='row vh-100'>
                    <div className={`col-6  ${styles.logincover}`}>
                    </div>


                    <div className='col-6 d-flex align-items-center justify-content-evenly'>
                        <form className='d-flex flex-column justify-content-center'>
                            <h1>Login</h1>
                            <p>Access to the Rentefi system</p>

                            <input className='mt-4 mb-2' type='email' name='email' size={40} placeholder='Email' required></input>

                            <input className='my-2' type='password' name='password' size={40} placeholder='Password' required></input>

                            <button type='submit' className='my-5'>Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login