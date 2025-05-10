import React from 'react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

function About() {
    return (
        <>
            <Navigation />

            <div className="container py-5">
                <div className="text-center mb-5">
                    <h1 className="display-5 fw-bold">
                        🌐 About Us | <span className="text-primary">RENTEFI</span>
                    </h1>
                    <p className="lead mt-3">
                        Welcome to <strong>RENTEFI</strong> — a smart, reliable, and modern car rental solution, built using the <strong>MERN Stack</strong> with a clean <strong>Bootstrap</strong> UI.
                    </p>
                </div>

                {/* Who We Are */}
                <section className="mb-5">
                    <h3 className="mb-3">🚗 Who We Are</h3>
                    <p className="text-muted">
                        <strong>RENTEFI</strong> is a student-built full-stack car rental platform focused on simplifying the car rental experience.
                        We bridge the gap between renters and providers through a transparent, efficient, and user-centric solution.
                    </p>
                </section>

                {/* What We Offer */}
                <section className="mb-5">
                    <h3 className="mb-3">🛠️ What We Offer</h3>
                    <ul className="list-group shadow-sm rounded">
                        <li className="list-group-item">✅ User-Friendly Interface – Built with Bootstrap for a seamless experience</li>
                        <li className="list-group-item">✅ Admin Dashboard – Manage bookings, users, and listings efficiently</li>
                        <li className="list-group-item">✅ Customer Panel – Simple signup, booking, and rental management</li>
                        <li className="list-group-item">✅ Real-Time Data – Live updates using MongoDB</li>
                        <li className="list-group-item">✅ Secure Authentication – Powered by JWT</li>
                        <li className="list-group-item">✅ Responsive Layout – Works perfectly across desktops, tablets, and mobiles</li>
                    </ul>
                </section>

                {/* Mission */}
                <section className="mb-5">
                    <h3 className="mb-3">💡 Our Mission</h3>
                    <p className="text-muted">
                        At <strong>RENTEFI</strong>, our mission is to revolutionize the car rental experience by offering a secure, fast, and affordable digital platform. We aim to make rentals simpler through cutting-edge web technologies and a user-first design philosophy.
                    </p>
                </section>

                {/* Technologies */}
                <section className="mb-5">
                    <h3 className="mb-3">🌍 Technologies We Use</h3>
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                        {[
                            'Frontend: React.js + Bootstrap',
                            'Backend: Node.js + Express.js',
                            'Database: MongoDB',
                            'Authentication: JWT',
                            'Hosting: Render / Vercel / Heroku'
                        ].map((tech, index) => (
                            <div key={index} className="col">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body text-center">
                                        <p className="card-text">{tech}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Team */}
                <section className="mb-5">
                    <h3 className="mb-3">👨‍💻 Meet the Team</h3>
                    <p className="text-muted">
                        <strong>RENTEFI</strong> is developed by a group of BS Computer Science students committed to real-world problem solving through full-stack development. This project showcases our teamwork, creativity, and proficiency in the MERN stack.
                    </p>
                </section>

                {/* Contact */}
                <section className="mb-5">
                    <h3 className="mb-3">📩 Contact Us</h3>
                    <div className="row">
                        <div className="col-md-4">
                            <p><strong>Email:</strong><br /> support@abc.com</p>
                        </div>
                        <div className="col-md-4">
                            <p><strong>Location:</strong><br /> Karachi, Pakistan</p>
                        </div>
                        <div className="col-md-4">
                            <p><strong>Phone:</strong><br /> +92-xxx-xxxxxxx</p>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </>
    )
}

export default About