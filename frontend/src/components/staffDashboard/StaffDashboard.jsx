import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function StaffDashboard() {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('http://localhost:5000/applications', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                const fetchedApplications = res.data;
                console.log(fetchedApplications); // Log fetched data to check its structure
                setApplications(fetchedApplications);
            } catch (error) {
                console.error("Error fetching applications:", error);
            }
        };
        fetchApplications();
    }, []);

    const handleReject = async (id) => {
        const reason = prompt("Please provide a reason for rejection:");
        if (!reason) return;

        await updateApplicationStatus(id, 'rejected', reason);

        // Toast message for rejection
        toast.error('Application rejected!');
    };

    const handleCollect = async (id) => {
        await updateApplicationStatus(id, 'collect');

        // Toast message for collect action
        toast.success('Application marked for collection!');
    };

    const handleCollected = async (id) => {
        await updateApplicationStatus(id, 'collected');

        // Toast message for collected action
        toast.success('Application collected!');
    };

    const updateApplicationStatus = async (id, status, reasonToReject = '') => {
        const token = localStorage.getItem('token');
        const decode = jwtDecode(token);
        const studentId = decode.id;
    
        const body = {
            status,
            ...(status === 'rejected' && { reasonToReject }),  // Only include reasonToReject if status is 'rejected'
        };
    
        try {
            await fetch(`http://localhost:5000/applications/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });
    
            setApplications((prev) =>
                prev.map((app) =>
                    app._id === id ? { ...app, status, reasonToReject } : app
                )
            );
        } catch (error) {
            console.error("Error updating application status:", error);
        }
    };
    
    const generatePDFReport = (application) => {
        const doc = new jsPDF();
        doc.text('Bonafide Certificate Application Report', 10, 10);
        doc.text(`Student Name: ${application.studentId.name}`, 10, 20);
        doc.text(`Email: ${application.studentId.email}`, 10, 30);
        doc.text(`Status: ${application.status}`, 10, 40);
        doc.text(`Applied Date: ${new Date(application.appliedDate).toLocaleDateString()}`, 10, 50);
        if (application.status === 'rejected') {
            doc.text(`Rejection Reason: ${application.reasonToReject}`, 10, 60);
        }
        doc.save(`Application_Report_${application._id}.pdf`);

        // Show success toast
        toast.success('Report downloaded successfully!');
    };

    // Generate PDF report for all applications
    const generateAllReports = () => {
        const doc = new jsPDF();
        doc.text('All Bonafide Certificate Applications', 10, 10);

        const headers = [['Student Name', 'Email', 'Status', 'Applied Date', 'Rejection Reason']];
        const data = applications.map((application) => [
            application.studentId.name,
            application.studentId.email,
            application.status,
            new Date(application.appliedDate).toLocaleDateString(),
            application.status === 'rejected' ? application.reasonToReject : 'N/A'
        ]);

        doc.autoTable({
            head: headers,
            body: data,
            startY: 20,
        });

        doc.save('All_Applications_Report.pdf');

        // Show success toast
        toast.success('All reports downloaded successfully!');
    };

    return (
        <div className="flex flex-col items-center p-8 bg-gray-50 min-h-screen">
            {/* Toast Container for Notifications */}
            <ToastContainer position="top-right" autoClose={3000} />

            <h1 className="text-4xl font-bold text-gray-800 mb-8">Staff Dashboard</h1>

            <div className="w-full max-w-6xl space-y-6">
                {applications.map((application) => (
                    <div key={application._id} className="bg-white shadow-xl p-6 border-t-4 border-sky-500 flex flex-col justify-between h-full">
                        <div className="bg-sky-500 text-white text-center text-2xl font-semibold py-3">
                            Application Details
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-gray-800">Student Information</h2>
                                <p className="text-gray-600"><strong>Name:</strong> {application.studentId?.name}</p>
                                <p className="text-gray-600"><strong>Email:</strong> {application.studentId?.email}</p>
                                <p className="text-gray-600"><strong>Reason to Apply:</strong> {application.reasonToApply}</p>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-gray-800">Application Status</h2>
                                <p className="text-gray-600"><strong>Status:</strong> {application.status}</p>
                                <p className="text-gray-600"><strong>Applied Date:</strong> {new Date(application.appliedDate).toLocaleDateString()}</p>
                                {application.status === 'rejected' && (
                                    <p className="text-gray-600"><strong>Rejection Reason:</strong> {application.reasonToReject}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between mt-6 border-t pt-4">
                            {application.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => updateApplicationStatus(application._id, 'approved')}
                                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 transition duration-300"
                                    >
                                        Approve
                                    </button>

                                    <button
                                        onClick={() => handleReject(application._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 transition duration-300"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}

                            {application.status === 'approved' && (
                                <button
                                    onClick={() => handleCollect(application._id)}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 transition duration-300"
                                >
                                    Collect
                                </button>
                            )}

                            {application.status === 'collect' && (
                                <button
                                    onClick={() => handleCollected(application._id)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 transition duration-300"
                                >
                                    Collected
                                </button>
                            )}
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => generatePDFReport(application)}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 transition duration-300"
                            >
                                Download Report
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Download All Reports Button */}
            <div className="mt-8 flex justify-center">
                <button
                    onClick={generateAllReports}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 transition duration-300"
                >
                    Download All Reports
                </button>
            </div>
        </div>
    );
}
