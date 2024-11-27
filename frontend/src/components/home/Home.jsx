import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import StaffDashboard from '../staffDashboard/StaffDashboard';
import Contact from '../contact/contact';

function Home() {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [username, setUsername] = useState(null);
    const [rollno, setRollno] = useState(null);
    const [isStaff, setIsStaff] = useState(false);
    const contact = useRef(null);
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            const decoded = jwtDecode(token);
            const studentId = decoded.id;
            const role = decoded.role;
            setIsStaff(role === 'staff');

            if (role === 'staff') {
                setUsername('Staff');
            } else {
                fetch(`http://localhost:5000/students/profile/${studentId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to fetch student data');
                        }
                        return response.json();
                    })
                    .then(data => {
                        setUsername(data.name);
                        setRollno(data.rollNo); 
                    })
                    .catch(error => console.error('Error fetching student data:', error));
            }
        }
    }, []);


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUsername(null);
        setRollno(null); // Reset rollno on logout
        setIsStaff(false);
        navigate('/login'); // Redirect to login page
    };

    const handleApplyClick = () => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/apply');
        } else {
            navigate('/login');
        }
    };

    // Function to smoothly scroll to the contact section
    const handleContactClick = () => {
        contact.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    return (
        <>
            {/* Navbar */}
            <nav className="bg-blue-800 p-4 shadow-lg py-8 ps-10">
                <div className="container mx-auto flex justify-between items-center">
                    <a href="#" className="text-white text-xl px-8 font-bold">Bonafide App</a>
                    <div className="hidden md:flex space-x-6 pe-10">

                        {username ? (
                            <>
                                <span className="font-semibold text-white text-lg ">
                                    {isStaff ? 'Staff' : `${username} (${rollno})`}
                                </span>

                                <button onClick={handleLogout} className="font-semibold text-white hover:underline">Log out</button>
                                {!isStaff ? (<>
                                    <Link to="/track" className="text-white font-semibold hover:text-gray-300">Track Application</Link>
                                </>) : null}
                            </>
                        ) : (
                            <Link to="/login" className="text-lg font-semibold text-white hover:text-sky-500">Log in</Link>
                        )}

                        <button onClick={handleContactClick} className="text-white font-semibold text-lg hover:text-gray-300">Contact</button>
                    </div>
                    <button
                        className="md:hidden text-white focus:outline-none"
                        onClick={toggleMobileMenu}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden">
                        <Link to="/login" className="text-white hover:text-gray-300">Log in</Link>
                        <Link to="/status" className="text-white hover:text-gray-300">Status</Link>
                        <button onClick={handleContactClick} className="text-white hover:text-gray-300">Contact</button>
                    </div>
                )}
            </nav>

            {/* Conditional Rendering */}
            {isStaff ? (
                <StaffDashboard />
            ) : (
                <div className="bg-gray-50 text-gray-900 min-h-screen">
                    <section className="flex items-center justify-center min-h-screen bg-gray-50">
                        <div className="text-center space-y-6 max-w-xl mx-4">
                            <h1 className="text-3xl md:text-5xl font-bold text-blue-700">Welcome to the Bonafied Application Platform</h1>
                            <p className="text-lg text-gray-700">
                                Easily apply for a Bonafide Certificate, track the application status, and view your application history.
                                Simplify your document processing with our platform.
                            </p>
                            <button className="bg-blue-600 text-white py-2 px-6 font-semibold hover:bg-blue-700 transition" onClick={handleApplyClick}>
                                Apply Now
                            </button>
                        </div>
                    </section>
                </div>
            )}

            <div className="flex flex-col h-40">
                <div ref={contact} className="flex-grow content-end">
                    <Contact />
                </div>
            </div>
        </>
    );
}

export default Home;
