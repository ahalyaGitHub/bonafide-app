import React, { useState} from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };
  return (
    <div>
        <nav className="bg-blue-600 p-4 shadow-lg py-6">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="text-white text-xl font-bold ms-10">Bonafide App</Link>
                    <div className="hidden md:flex space-x-6">
                        
                        
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
                        <Link to="/contact" className="text-white hover:text-gray-300">Contact</Link>
                    </div>
                )}
            </nav>
    </div>
  )
}
