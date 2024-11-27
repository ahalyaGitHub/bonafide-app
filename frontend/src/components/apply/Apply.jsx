import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Ensure correct import
import Navbar from '../navbar/Navbar';
import { toast } from 'react-toastify';

const Apply = () => {
    const [studentId, setStudentId] = useState('');
    const [reason, setReason] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setStudentId(decodedToken.id);
            } catch (error) {
                console.error('Error decoding token:', error);
                alert('Invalid token. Please log in again.');
            }
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reason.trim()) {
            alert('Please provide a reason for applying.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('You need to be logged in to submit your application.');
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:5000/applications/apply`,
                {
                    studentId,
                    reasonToApply: reason,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                toast.success('Application submitted successfully!');
                setReason('');
            } else {
                toast.error('Failed to submit the application. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            toast.error(error?.response?.data?.error || 'An unexpected error occurred.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="max-w-lg w-full bg-white shadow-lg  p-6">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">
                        Bonafide Certificate Application
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="reason"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Reason for Applying:
                            </label>
                            <textarea
                                id="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Enter your reason for applying"
                                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                rows="5"
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white font-bold py-3 hover:bg-blue-600 transition duration-300"
                        >
                            Submit Application
                        </button>
                    </form>
                    <p className="text-sm text-gray-600 mt-4 text-center">
                        Please ensure all details are accurate before submitting.
                    </p>
                </div>
            </div>
        </>
    );
};

export default Apply;
