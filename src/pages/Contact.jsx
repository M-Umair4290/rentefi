import React from 'react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

function Contact() {
    return (
        <>
            <Navigation />

            <div className="container-fluid vh-100">
                <div className="container py-5">
                    <h2 className="text-center mb-4">Contact Us</h2>
                    <div className="row">
                        {/* Contact Form */}
                        <div className="col-md-6 mb-4">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Your Name</label>
                                    <input type="text" className="form-control" id="name" placeholder="Enter your name" required />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Your Email</label>
                                    <input type="email" className="form-control" id="email" placeholder="Enter your email" required />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label">Your Message</label>
                                    <textarea className="form-control" id="message" rows="4" placeholder="Enter your message" required></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary w-100">Send Message</button>
                            </form>
                        </div>

                        {/* Contact Info & Map */}
                        <div className="col-md-6">
                            <div className="mb-4">
                                <h5>Our Office</h5>
                                <p>RENTEFI Rent A Car Service<br />
                                    Street #123, Block A, Karachi, Pakistan<br />
                                    Phone: +92 300 1234567<br />
                                    Email: contact@rentefi.com
                                </p>
                            </div>

                            <div>
                                <h5>Our Location</h5>
                                <div className="ratio ratio-16x9">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.0310027554983!2d67.0554855!3d24.862790699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f24a7d2b7bb%3A0xa5921defea9b8371!2sLogic%20Racks!5e0!3m2!1sen!2s!4v1746860443304!5m2!1sen!2s"
                                        width="600"
                                        height="450"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Contact