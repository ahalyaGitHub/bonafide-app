import React from 'react';

function Contact() {
    return (
        <footer className="bg-blue-800 text-white py-6">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-xl font-bold text-center mb-4">Contact Us</h2>
                <div className="flex flex-col items-center md:flex-row md:justify-between">
                    {/* Contact Information */}
                    <div className="mb-4 md:mb-0">
                        <h3 className="font-semibold">Get in Touch</h3>
                        <p>Email: <a href="mailto:support@bonafiedapp.com" className="hover:underline">support@bonafiedapp.com</a></p>
                        <p>Phone: <a href="tel:+1234567890" className="hover:underline">+1 234 567 890</a></p>
                    </div>
                    {/* Social Media Links */}
                    <div>
                        <h3 className="font-semibold">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a href="https://facebook.com" className="hover:underline" target="_blank" rel="noopener noreferrer">Facebook</a>
                            <a href="https://twitter.com" className="hover:underline" target="_blank" rel="noopener noreferrer">Twitter</a>
                            <a href="https://instagram.com" className="hover:underline" target="_blank" rel="noopener noreferrer">Instagram</a>
                        </div>
                    </div>
                </div>
                <p className="text-center text-sm mt-4">© 2024 Bonafied Application. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Contact;
