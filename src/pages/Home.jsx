import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {

    const navigate = useNavigate();

    const gotoLogin = () => {
        navigate('/login')
    }

    const gotoSignup = () => {
        navigate('/signup')
    }

    return (
        <>
            <button onClick={gotoLogin}>Login</button>
            <button onClick={gotoSignup}>Signup</button>
        </>
    )
}

export default Home