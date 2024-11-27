import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Removed destructuring
import Navbar from '../navbar/Navbar';

const TrackApplication = () => {
    const [applicationStatus, setApplicationStatus] = useState({
        pending: [],
        approved: [],
        rejected: [],
        collect: [],
        collected: []
    });

    useEffect(() => {
        const fetchApplicationStatus = async () => {
            const token = localStorage.getItem("token");
            if (!token) return console.error('No token found!');
            const decoded = jwtDecode(token);
            const userId = decoded.id;

            try {
                const response = await axios.get(`http://localhost:5000/applications/track/${userId}`);
                console.log('Fetched application status:', response.data);
                setApplicationStatus(response.data.applicationStatus);
            } catch (error) {
                console.error('Error fetching application status:', error);
            }
        };
        fetchApplicationStatus();
    }, []);

    const renderApplication = (applications) =>
        applications?.map((application) => (
            <div
    key={application._id}
    className="bg-white shadow-lg p-6 mb-6 transition-transform transform hover:scale-105 hover:shadow-xl border border-gray-200"
>
    <h1 className="text-gray-800 font-semibold text-xl mb-2">
        Reason to apply: <span className="font-normal text-gray-600">{application.reasonToApply}</span>
    </h1>
    <p className="text-gray-700 font-semibold mb-1">
        Status: <span className="font-normal text-gray-500">{application.status}</span>
    </p>
    <p className="text-gray-700 font-semibold mb-3">
        Applied on: <span className="font-normal text-gray-500">{new Date(application.appliedDate).toLocaleDateString()}</span>
    </p>
    {application.reasonToReject && (
        <p className="text-red-500 font-semibold mt-2">
            Rejection Reason: <span className="font-normal">{application.reasonToReject}</span>
        </p>
    )}
</div>

        ));

    return (
        <>
            <Navbar />
            <div className="flex flex-col max-w-5xl mx-auto p-8 space-y-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Application Status</h2>
                <div className="grid grid-cols-1 gap-8">
                    <div className="w-full bg-yellow-50 shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-yellow-800 mb-4">Pending</h3>
                        {applicationStatus.pending?.length ? (
                            renderApplication(applicationStatus.pending)
                        ) : (
                            <p className="text-gray-500">No pending applications.</p>
                        )}
                    </div>

                    <div className="w-full bg-green-50 shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-green-800 mb-4">Approved</h3>
                        {applicationStatus.approved?.length ? (
                            renderApplication(applicationStatus.approved)
                        ) : (
                            <p className="text-gray-500">No approved applications.</p>
                        )}
                    </div>

                    <div className="w-full bg-red-50 shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-red-800 mb-4">Rejected</h3>
                        {applicationStatus.rejected?.length ? (
                            renderApplication(applicationStatus.rejected)
                        ) : (
                            <p className="text-gray-500">No rejected applications.</p>
                        )}
                    </div>

                    <div className="w-full bg-blue-50 shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-blue-800 mb-4">Collect</h3>
                        {applicationStatus.collect?.length ? (
                            renderApplication(applicationStatus.collect)
                        ) : (
                            <p className="text-gray-500">No applications to collect.</p>
                        )}
                    </div>

                    <div className="w-full bg-gray-50 shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Collected</h3>
                        {applicationStatus.collected?.length ? (
                            renderApplication(applicationStatus.collected)
                        ) : (
                            <p className="text-gray-500">No collected applications.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TrackApplication;
