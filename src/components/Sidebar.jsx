import React from 'react'
import { NavLink } from 'react-router-dom'

function Sidebar() {
    return (
        <>
            <div className='d-flex'>

                <div className='bg-dark text-light' style={{ width: '250px', minHeight: '100vh' }}>

                    <nav className=''>
                        <ul className='list-unstyled d-flex flex-column justify-content-end align-items-center'>
                            <li className='list-unstyled my-2 py-2'>
                                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active text-primary' : 'nav-link'}>Dashboard</NavLink>
                            </li>

                            <li className='list-unstyled my-2 py-2'>
                                <NavLink to="/customers" className={({ isActive }) => isActive ? 'nav-link active text-primary' : 'nav-link'}>Customers</NavLink>
                            </li>

                            <li className='list-unstyled my-2 py-2'>
                                <NavLink to="/bookings" className={({ isActive }) => isActive ? 'nav-link active text-primary' : 'nav-link'}>Bookings</NavLink>
                            </li>

                            <li className='list-unstyled my-2 py-2'>
                                <NavLink to="/vehicles" className={({ isActive }) => isActive ? 'nav-link active text-primary' : 'nav-link'}>Vehicles</NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default Sidebar