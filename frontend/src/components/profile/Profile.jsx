import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';  // Fix the import to use the correct function
import Navbar from '../navbar/Navbar';

export default function Profile() {
    const [student, setStudent] = useState({
        name: '',
        rollNo: '',
        department: '',
        email: '',
        profileImage: '',
        year: 1,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [newYear, setNewYear] = useState('');
    const [newProfileImage, setNewProfileImage] = useState(null);

    useEffect(() => {
        const fetchStudentData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = jwtDecode(token);
                const studentId = decoded.id;
                try {
                    const response = await axios.get(`http://localhost:5000/students/profile/${studentId}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    setStudent(response.data);
                    setNewYear(response.data.year);
                } catch (error) {
                    console.error('Error fetching student data:', error);
                }
            }
        };
        fetchStudentData();
    }, []);

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const formData = new FormData();
                if (newProfileImage) {
                    formData.append('profileImage', newProfileImage);
                }
                formData.append('year', newYear);

                const decoded = jwtDecode(token);
                const studentId = decoded.id;

                const response = await axios.put(
                    `http://localhost:5000/students/profile/${studentId}`,
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data', // For file upload
                        },
                    }
                );
                setStudent(response.data);
                setIsEditing(false);
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        }
    };

    return (
        <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center bg-sky-200 p-4">
            <h1 className="text-3xl font-bold mb-4">Profile</h1>
            <div className="max-w-md w-full bg-white rounded-lg p-6 shadow-lg">
                <div className="flex justify-center mb-4">
                    <img
                        src={student.profileImage || 'https://via.placeholder.com/150'}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover"
                    />
                </div>

                {/* Edit or View Mode */}
                {isEditing ? (
                    <div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Change Profile Image</label>
                            <input
                                type="file"
                                onChange={(e) => setNewProfileImage(e.target.files[0])}
                                className="mt-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Year of Education</label>
                            <select
                                value={newYear}
                                onChange={(e) => setNewYear(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="1st Year">1st Year</option>
                                <option value="2nd Year">2nd Year</option>
                                <option value="3rd Year">3rd Year</option>
                                <option value="4th Year">4th Year</option>
                                <option value="Graduated">Graduated</option>
                            </select>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="mb-4">
                            <p><strong>Name:</strong> {student.name}</p>
                            <p><strong>Roll No:</strong> {student.rollNo}</p>
                            <p><strong>Department:</strong> {student.department}</p>
                            <p><strong>Email:</strong> {student.email}</p>
                            <p><strong>Year of Education:</strong> {student.year}</p>
                        </div>
                    </div>
                )}

                <div className="flex justify-between mt-6">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                    >
                        {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                    {isEditing && (
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
                        >
                            Save
                        </button>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}
